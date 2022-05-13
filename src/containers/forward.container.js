import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

const useForward = () => {
	const [maxUsers, setMaxUsers] = useState();

	return { maxUsers, setMaxUsers };
};

const ForwardContainer = createContainer(useForward);

export default ForwardContainer;
