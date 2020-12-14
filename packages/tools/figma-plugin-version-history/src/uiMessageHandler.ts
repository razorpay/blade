const eventListeners: { type: String; callback: Function }[] = [];
export const dispatch = (action: String, data?: any) => {
	parent.postMessage({ pluginMessage: { action, data } }, '*');
};
export const handleEvent = (type: String, callback: Function) => {
	eventListeners.push({ type, callback });
};
window.onmessage = event => {
	const message = event.data.pluginMessage;
	if (message) {
		for (let eventListener of eventListeners) {
			if (message.action === eventListener.type) eventListener.callback(message.data);
		}
	}
};
