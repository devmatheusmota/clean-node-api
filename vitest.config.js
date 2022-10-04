import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		includeSource: ['**/*{test,spec}.{js}'],
		watchExclude: ['**/node_modules/**'],
		deps: {
			external: ['./node_modules'],
		},
	},
});
