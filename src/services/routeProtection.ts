import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppSelector } from '@/redux/hooks';

type GuardProps = {
	children: React.ReactElement;
	redirectTo?: string;
};

// Redirects authenticated users away from auth pages (signin / signup)
export function RedirectIfAuthenticated({ children, redirectTo = '/chat' }: GuardProps) {
	const isAuthenticated = useAppSelector((s) => s.account.isAuthenticated);
	const location = useLocation();
    const navigate = useNavigate();

	if (isAuthenticated) {
		navigate(redirectTo, { replace: true, state: { from: location } });
		return null;
	}

	return children;
}

// Protect routes that require authentication: redirect to signin when not authed
export function RequireAuth({ children, redirectTo = '/signin' }: GuardProps) {
	const isAuthenticated = useAppSelector((s) => s.account.isAuthenticated);
	const location = useLocation();
    const navigate = useNavigate();

	if (!isAuthenticated) {
		navigate(redirectTo, { replace: true, state: { from: location } });
		return null;
	}

	return children;
}

export default RedirectIfAuthenticated;
