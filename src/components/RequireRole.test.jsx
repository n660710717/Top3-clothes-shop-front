import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import RequireRole from './RequireRole';

function renderWithRole(role, isLoggedIn = true) {
  return render(
    <AuthContext.Provider value={{ role, isLoggedIn }}>
      <MemoryRouter initialEntries={['/seller']}>
        <Routes>
          <Route path="/login" element={<h1>หน้า Login</h1>} />
          <Route
            path="/seller"
            element={
              <RequireRole allowedRoles={['seller', 'admin']}>
                <h1>ศูนย์ผู้ขาย</h1>
              </RequireRole>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('RequireRole Component', () => {
  test('หากเป็น Buyer เข้ามาหน้า Seller ต้องเห็นหน้า 403 Forbidden', () => {
    renderWithRole('buyer');
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.queryByText('ศูนย์ผู้ขาย')).not.toBeInTheDocument();
  });

  test('หากเป็น Seller เข้ามา ต้องเห็นหน้าศูนย์ผู้ขาย', () => {
    renderWithRole('seller');
    expect(screen.getByText('ศูนย์ผู้ขาย')).toBeInTheDocument();
  });
});