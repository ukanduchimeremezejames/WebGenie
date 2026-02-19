import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Activity, User, Sun, Search, ChevronDown, Bell, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { searchIndex } from './../../data/searchIndex';

const navLinks = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    items: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Algorithm Performance', path: '/dashboard/performance' },
      { label: 'Algorithm Comparison', path: '/dashboard/comparison' },
      { label: 'Recent Results', path: '/dashboard/recent' },
    ],
  },
  {
    label: 'Datasets',
    path: '/datasets',
    items: [
      { label: 'All Datasets', path: '/datasets' },
      { label: 'Dataset Search', path: '/datasets/search' },
      { label: 'Dataset Metadata', path: '/datasets/metadata' },
      { label: 'Upload Dataset', path: '/upload' },
    ],
  },
  {
    label: 'Compare',
    path: '/compare',
    items: [
      { label: 'Algorithm Comparison', path: '/compare' },
      { label: 'Algorithm Selection', path: '/compare/select' },
      { label: 'Metric Explorer', path: '/compare/metrics' },
      { label: 'PR/ROC Overlay', path: '/compare/roc' },
      { label: 'Top Motif Enrichment', path: '/compare/enrichment' },
    ],
  },
  {
    label: 'Explorer',
    path: '/explorer',
    items: [
      { label: 'Network Explorer', path: '/explorer' },
      { label: 'Gene Search', path: '/explorer/search' },
      { label: 'Network Visualization', path: '/explorer/visualization' },
      { label: 'Gene Details', path: '/explorer/details' },
    ],
  },
  {
    label: 'Upload',
    path: '/upload',
    items: [
      { label: 'Upload Overview', path: '/upload' },
      { label: 'Upload File', path: '/upload/file' },
      { label: 'Job Configuration', path: '/upload/config' },
      { label: 'File Formats', path: '/upload/formats' },
      { label: 'Recent Jobs', path: '/upload/recent' },
      { label: 'Validation Reports', path: '/upload/report' },
    ],
  },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (userRef.current && !userRef.current.contains(event.target as Node)) {
      setShowUserMenu(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

{/* <div className="relative" ref={notifRef}>
  <button
    className="relative p-2 rounded-full hover:bg-accent transition-colors"
    onClick={() => setShowNotifications(!showNotifications)}
  >
    <Bell className="w-5 h-5" />
    <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-md shadow-lg z-50 p-2">
      <div className="text-sm font-medium mb-2 border-b border-border pb-1">Project Info</div>
      <ul className="space-y-1 text-xs">
        <li>🚀 Version: 1.0.0</li>
        <li>📅 Last update: Feb 3, 2026</li>
        <li>⚡ Status: Active development</li>
        <li>📝 Tasks pending: 5</li>
        <li>📂 Dataset count: 42</li>
      </ul>
    </div>
  )}
</div> */}

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notFoundOpen, setNotFoundOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavClick = (path: string) => {
    const currentPath = location.pathname;
    let targetId = '/';

    if (path.startsWith('/dashboard') && currentPath === '/dashboard') {
      targetId = path.replace('/dashboard', '') || '/';
      const el = document.getElementById(targetId === '/' ? 'overview' : targetId.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (path.startsWith('/datasets') && currentPath === '/datasets') {
      targetId = path.replace('/datasets', '') || '/';
      const el = document.getElementById(targetId === '/' ? 'datasets' : targetId.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (path.startsWith('/compare') && currentPath === '/compare') {
      targetId = path.replace('/compare', '') || '/';
      const el = document.getElementById(targetId === '/' ? 'compare' : targetId.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (path.startsWith('/explorer') && currentPath === '/explorer') {
      targetId = path.replace('/explorer', '') || '/';
      const el = document.getElementById(targetId === '/' ? 'explorer' : targetId.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (path.startsWith('/upload') && currentPath === '/upload') {
      targetId = path.replace('/upload', '') || '/';
      const el = document.getElementById(targetId === '/' ? 'upload' : targetId.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate(path);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();

    const exactMatch = searchIndex.find(item => item.label.toLowerCase() === query);
    if (exactMatch) {
      navigate(exactMatch.path);
      setSearchQuery('');
      setMobileOpen(false);
      return;
    }

    const partialMatch = searchIndex.find(item => item.label.toLowerCase().includes(query));
    if (partialMatch) {
      navigate(partialMatch.path);
      setSearchQuery('');
      setMobileOpen(false);
      return;
    }

    setLastQuery(searchQuery);
    setNotFoundOpen(true);

    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-full w-full flex items-center justify-between h-16 px-4">

        {/* Left: Logo + Mobile Hamburger */}
        <div className="flex items-center gap-4">

          <button
            className="p-2 rounded-md hover:bg-accent lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              {/* <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg> */}
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">WebGenie</span>
              <span className="text-xs text-muted-foreground leading-none">
                Benchmarking
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 flex-1 ml-8">
          {navLinks.map((link) => (
            <DropdownMenu
              key={link.path}
              open={openDropdown === link.label}
              onOpenChange={(open) => setOpenDropdown(open ? link.label : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive(link.path)
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-48">
                {link.items.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.path);
                      }}
                      className={`w-full text-left px-2 py-1 ${
                        location.pathname === item.path ? 'bg-accent' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {/* <input
              type="text"
              placeholder="Search datasets, algorithms..."
              className="pl-10 w-64 px-3 py-1.5 text-sm bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            /> */}
            <input
              type="text"
              placeholder="Search datasets, algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-10 w-64 px-3 py-1.5 text-sm bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />

          </div>

          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-accent transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-60 mr-3 w-64 bg-card border border-border rounded-md shadow-lg z-50 p-2">
              <div className="text-sm font-medium mb-2 border-b border-border pb-1">WebGenie Project Info</div>
              <ul className="space-y-1 text-xs">
                <li>🚀 Version: 1.0.0</li>
                <li>📅 Last update: Feb 3, 2026</li>
                <li>⚡ Status: Active development</li>
                <li>📝 Tasks pending: 5</li>
                <li>📂 Total Dataset: 12</li>
                {/* <li>📂 Beeline Algorithms: 12</li> */}
              </ul>
            </div>
          )}

          {notFoundOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center mt-50 bg-black/50">
              <div className="bg-card w-full max-w-md rounded-lg border border-border shadow-xl p-6">
                
                <h2 className="text-lg font-semibold mb-2">
                  Not available
                </h2>

                <p className="text-sm text-muted-foreground mb-4">
                  We couldn’t find anything matching{" "}
                  <span className="font-medium text-foreground">
                    “{lastQuery}”
                  </span>
                </p>

                {/* Available items */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Available datasets & algorithms
                  </div>

                  <div className="max-h-40 overflow-y-auto rounded-md border border-border">
                    {searchIndex.map(item => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setNotFoundOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex justify-between"
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setNotFoundOpen(false);
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-accent"
                  >
                    Try again
                  </button>

                  <button
                    onClick={() => setNotFoundOpen(false)}
                    className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}


          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <div className="relative flex items-center justify-center w-5 h-5">
              <Sun className="absolute w-5 h-5 transition-all duration-300 dark:opacity-0 dark:scale-75 opacity-100 scale-100" />
              <Moon className="absolute w-5 h-5 transition-all duration-300 opacity-0 scale-75 dark:opacity-100 dark:scale-100" />
            </div>
          </button>

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            <div className="relative" ref={userRef}>
              <button
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium hover:bg-secondary transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-4 h-4 text-white" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-8 w-48 bg-card border border-border rounded-md shadow-lg z-50 p-2">
                  <div className="text-sm font-medium mb-2 border-b border-border pb-1 text-gray-500">User Menu (For Admins)</div>
                  <ul className="space-y-1 text-xs">
                    <li className="hover:bg-accent rounded px-2 py-1 cursor-pointer text-gray-500">👤 Profile</li>
                    <li className="hover:bg-accent rounded px-2 py-1 cursor-pointer text-gray-500">⚙️ Settings</li>
                    <li className="hover:bg-accent rounded px-2 py-1 cursor-pointer text-gray-500">🛠️ Projects</li>
                    <li className="hover:bg-accent rounded px-2 py-1 cursor-pointer text-gray-500">🚪 Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-card/95 backdrop-blur border-t z-40 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <div key={link.label}>
              <div className="font-semibold text-sm mb-2">{link.label}</div>
              <div className="flex flex-col space-y-1 pl-2">
                {link.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      handleNavClick(item.path);
                    }}
                    className={`text-sm text-left py-1 ${
                      location.pathname === item.path
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          /> */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <div className="absolute mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50">
              {searchIndex
                .filter(item =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5)
                .map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {item.type}
                    </span>
                  </button>
                ))}
            </div>
          )}


        </div>
      )}
    </nav>
  );
}
