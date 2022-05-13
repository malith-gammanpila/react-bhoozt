import { useRef } from 'react';

/**
 * Count component renders
 * @param {String} component Component name
 * @note Use inside ui components and pass component's name to identify render count logs
 */
const useCountRenders = component => {
	const renders = useRef(0);
	component
		? console.log(`Renders: (${component})`, renders.current++)
		: console.error(
				'[useCountRenders] Please pass component name to identify render count logs.'
		  );
};

export default useCountRenders;
