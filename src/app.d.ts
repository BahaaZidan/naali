import 'unplugin-icons/types/svelte';
import type { Session as AuthSession, User as AuthUser } from '@auth/core/types';

declare global {
	namespace App {
		interface Session extends AuthSession {
			user?: {
				handle?: string;
			} & AuthUser;
		}
	}
}

export {};
