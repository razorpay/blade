const eventListeners: { type: String; callback: Function }[] = [];
export const dispatch = (action: String, data?: any) => {
	figma.ui.postMessage({ action, data });
};
export const handleEvent = (type: String, callback: Function) => {
	eventListeners.push({ type, callback });
};
figma.ui.onmessage = message => {
	for (let eventListener of eventListeners) {
		if (message.action === eventListener.type) eventListener.callback(message.data);
	}
};
