import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { Container, StyledFooter, StyledColumn, Row } from '../styles/styles';
import NavHeader from '../common/navHeader';
import { InputField } from '../common/input';
import { smallScreen, mediumScreen } from '../../utils/media';
import { RectangularButton } from '../common/button';
import useWindowDimensions from '../../hooks/windowDimention.hook';
import useForgot from '../../containers/forgot.container';

const ForgotContainer = styled.div`
	margin: 0 auto;
	padding: 25px 0px;
	@media ${smallScreen} {
		min-height: ${props => `${props.height - 132}px`};
	}
	@media ${mediumScreen} {
		min-height: ${props => `${props.height - 147}px`};
	}
`;

const StyledLabel = styled.p`
  text-align: left;
  color: ${colors.darkGreen}
  margin-top: 10px;
  margin-bottom: 20px!important;
  @media ${smallScreen} {
    width: 300px !important;
    font-size: 14px !important;
  }
  @media ${mediumScreen} {
    width: 500px !important;
    font-size: 16px !important;
  }
`;

const ForgotPass = props => {
	const { height } = useWindowDimensions();
	const { data, setData, handleChange, handleSubmit } = useForgot();

	// const { token } = props.location;

	useEffect(() => {
		handleSetToken();
	}, []);

	const handleSetToken = () => {
		if (props.location.search) {
			setData(data => ({
				...data,
				token: props.location.search.replace('?token=', ''),
			}));
		}
	};

	return (
		<>
			<Container>
				<NavHeader
					title={'Change Password'}
					onRedirect={'/resetpassword'}
				/>
				<ForgotContainer height={height} >
					<Row>
						<StyledColumn>
							<InputField
								label={'New Password *'}
								type={'password'}
								name={'password'}
								onChange={handleChange}
								value={data.password}
							/>
						</StyledColumn>
					</Row>
					<Row>
						<StyledColumn>
							<InputField
								label={'Re Enter Password *'}
								type={'password'}
								name={'confirmPassword'}
								onChange={handleChange}
								value={data.confirmPassword}
							/>
						</StyledColumn>
					</Row>
					<Row>
						<StyledColumn>
							<StyledLabel>
								* These fields are required
							</StyledLabel>
						</StyledColumn>
					</Row>
				</ForgotContainer>

				<StyledFooter>
					<RectangularButton
						width={'90%'}
						label={'Confirm'}
						color={colors.green}
						onRedirect={handleSubmit}
					/>
				</StyledFooter>
			</Container>
		</>
	);
};

export default ForgotPass;
