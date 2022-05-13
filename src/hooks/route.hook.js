import { useHistory } from 'react-router-dom';

const useRoute = () => {
	const history = useHistory();

	const handleRedirect = (path, key) => {
		history.push(path);
	};

	const handleGoBack = () => {
		history.goBack();
	};

	return { handleRedirect, handleGoBack };
};

export default useRoute;
