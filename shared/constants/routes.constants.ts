export const CLIENT_ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	VERIFY_EMAIL: '/verify-email',
	RESET_PASSWORD: '/reset-password',
};

export const SERVER_ROUTES = {
	BASE: '/api',
	USER: {
		version: 'v1',
		BASE: '/user',
		ROUTES: {
            BASE: '/',
			REGISTER: '/register',
			RESET_PASSWORD: '/reset-password',
			RESET_PASSWORD_EMAIL: '/reset-password/email',
			VERIFICATION_EMAIL: '/verification-email',
			CHANGE_PASSWORD: '/password',
			UPDATE_USER_DATA: '/',
		},
	},
	AUTH: {
		version: 'v1',
		BASE: '/auth',
		ROUTES: {
			LOGIN: '/login',
			LOGOUT: '/logout',
			REFRESH_TOKEN: '/refresh-token',
			GOOGLE: '/google',
		},
	},
};
