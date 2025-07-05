import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

export default function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    toast.success('Logged out successfully');
  };

  const isActive = path => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">InventorySys</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className={isActive('/products')} to="/products">Products</Link></li>
          <li className="nav-item"><Link className={isActive('/orders')} to="/orders">Orders</Link></li>
          <li className="nav-item"><Link className={isActive('/suppliers')} to="/suppliers">Suppliers</Link></li>
          <li className="nav-item"><Link className={isActive('/customers')} to="/customers">Customers</Link></li>
          <li className="nav-item"><Link className={isActive('/barcode-scanner')} to="/barcode-scanner">Scan</Link></li>
        </ul>
        <Link className="btn btn-outline-light" to="/logout" onClick={handleLogout}>Logout</Link>
      </div>
    </nav>
  );
}
