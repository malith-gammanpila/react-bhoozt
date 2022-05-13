import React, { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Offline, Online, Detector } from 'react-detect-offline';
import 'pure-react-carousel/dist/react-carousel.es.css';

import './assets/fonts/fontello/fontello.css';
import './app.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { Request } from './api/requestHandler.api';
import { MainRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import profileContainer from './containers/profile.container';
import HomeContainer from './containers/home.container';
import PushContainer from './containers/push.container';
import NotifiContainer from './containers/notification.container';
import NetworkContainer from './containers/network.container';
import AdvertisementContainer from './containers/advertisement.container';
import messages from './containers/messages.container';
import MaintenanceContainer from './containers/maintenance.container';
import SuspendContainer from './containers/suspend.container';
import QrContainer from './containers/qr.container';
import OtpContainer from './containers/otp.container';
import RegisterContainer from './containers/register.container';
import ForwardContainer from './containers/forward.container';
import FriendsContainer from './containers/friends.container';
import CreateFunContainer from './containers/createFun.container';
import AnalyticContainer from './containers/analytic.container';
import useLogin from './containers/login.container';

import {
	MaintenanceModal,
	FlaggedModal,
	VerifyMobileModal,
	OtpModal,
	FullscreenModal,
} from './components/common/modal';
import useModal from './containers/modal.container';

const App = () => {
	const {
		handleOpenRegisterModal,
		handleOpenProfileModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();
	const OfflineDetector = () => {
		const {
			handleOpenMaintenanceModal,
		} = MaintenanceContainer.useContainer();
		const { handleOpenFlaggedModal } = SuspendContainer.useContainer();
		const { setIsOnline } = NetworkContainer.useContainer();
		const { notifyError } = messages();
		const {
			setMobileVisible,
			setUserData,
			handleSetUserData,
		} = OtpContainer.useContainer();
		const { handleLogout } = useLogin();

		// Response interceptor
		Request.interceptors.response.use(
			(response) => {
				if (process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production') {
					// 	console.log(
					// 		response.config.method.toUpperCase(),
					// 		response.config.url,
					// 		response.config.url.replace(
					// 			response.config.baseURL,
					// 			''
					// 		),
					// 		response
					// 	);
				} // DEBUG
				return response;
			},
			(error) => {
				if (process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production') {
					// console.log(
					// 	error.response.config.method.toUpperCase(),
					// 	error.response.config.url.replace(
					// 		error.response.config.baseURL,
					// 		''
					// 	),
					// 	// error.response.config.url,
					// 	error.response,
					// 	error.response.status
					// );
				} // DEBUG

				if (error.response) {
					if (error.response.status === 423) {
						setTimeout(() => {
							handleOpenFlaggedModal();
						}, 1000);
					} else if (error.response.status === 403) {
						if (window.location.pathname) {
							if (window.location.pathname !== '/') {
								console.log('Error: 403');
								setTimeout(() => {
									handleLogout().then(
										notifyError(error.response.data.message)
									);
								}, 2000);
							}
						}
					} else if (error.response.status === 422) {
						setTimeout(() => {
							// notifyError(
							// 	error.response.message ||
							// 		error.response.data.message ||
							// 		`Something went wrong. [HTTP:${error.response.status}]`
							// );
							// DEBUG
							console.log(
								error.response.data.message || 'Error: 422'
							);
						}, 1000);
					} else if (
						error.response.status === 401 &&
						error.response.config.url.replace(
							error.response.config.baseURL,
							''
						) !== '/user/sign_in'
					) {
						if (
							error.response.data &&
							error.response.data.content &&
							error.response.data.content.user
						) {
							handleSetUserData(error.response.data.content.user);
						}

						setTimeout(() => {
							setMobileVisible(true);
						}, 1000);
					} else if (error.response.status === 503) {
						setTimeout(() => {
							handleOpenMaintenanceModal(
								error.response.message ||
									error.response.data.message
							);
						}, 1000);
					} else if (error.response.status === 410) {
						setTimeout(() => {
							console.log('Error:', error.response.data.message);
							handleOpenRegisterModal();
						}, 1000);
					} else if (
						error.response.status >= 300 &&
						error.response.status < 500
					) {
						setTimeout(() => {
							console.log(error.response);
						}, 1000);
					}
				} else if (error.response.status >= 500) {
					setTimeout(() => {
						notifyError(
							error.response.message ||
								error.response.data.message ||
								`Internal server error. Please try again later. [HTTP:${error.response.status}]`
						);
					}, 1000);
				}
				return Promise.reject(error);
			}
		);

		return (
			<Detector
				render={({ online }) => {
					if (online) {
						setIsOnline(true);
						return null;
					} else {
						setIsOnline(false);
						return null;
					}
				}}
			/>
		);
	};

	return (
		<BrowserRouter>
			<AnalyticContainer.Provider>
				<NetworkContainer.Provider>
					<MaintenanceContainer.Provider>
						<SuspendContainer.Provider>
							<OtpContainer.Provider>
								<OfflineDetector />
								<div>
									<MaintenanceModal />
									<FlaggedModal />
									<VerifyMobileModal />
									<OtpModal />
									<HomeContainer.Provider>
										<FriendsContainer.Provider>
											<CreateFunContainer.Provider>
												<NotifiContainer.Provider>
													<QrContainer.Provider>
														<AdvertisementContainer.Provider>
															<PushContainer.Provider>
																<profileContainer.Provider>
																	<RegisterContainer.Provider>
																		<ForwardContainer.Provider>
																			<MainRoutes />
																			<FullscreenModal
																				handleCloseModal={
																					handleCloseModal
																				}
																				isModalVisible={
																					isModalVisible
																				}
																				modalType={
																					modalType
																				}
																			/>
																		</ForwardContainer.Provider>
																	</RegisterContainer.Provider>
																</profileContainer.Provider>
															</PushContainer.Provider>
														</AdvertisementContainer.Provider>
													</QrContainer.Provider>
												</NotifiContainer.Provider>
											</CreateFunContainer.Provider>
										</FriendsContainer.Provider>
									</HomeContainer.Provider>
								</div>

								<ToastContainer />
							</OtpContainer.Provider>
						</SuspendContainer.Provider>
					</MaintenanceContainer.Provider>
				</NetworkContainer.Provider>
			</AnalyticContainer.Provider>
		</BrowserRouter>
	);
};

export default App;
