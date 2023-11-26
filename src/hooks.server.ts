import { connectD1 } from 'wrangler-proxy';

export const handle = ({ event, resolve }) => {
	event.locals.DB = event.platform?.env?.DB ?? connectD1('DB');
	// or connectD1('D1', { hostname: 'custom-host-name' });
	// default hostname is `http://127.0.0.1:8787`
	return resolve(event);
};
