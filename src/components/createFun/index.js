import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Button, Checkbox, Icon } from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { mediumScreen, smallScreen } from '../../utils/media';
import { Container } from '../styles/styles';
import NavHeader from '../common/navHeader';
import ProfileImg from '../../assets/images/user_image.svg';
import Camera from '../../assets/images/camera-button.svg';
import { colors } from '../../utils/colors';

import useWindowDimensions from '../../hooks/windowDimention.hook';
import HomeContainer from '../../containers/home.container';
import CreateFunContainer from '../../containers/createFun.container';
import FriendsContainer from '../../containers/friends.container';
import useModal from '../../containers/modal.container';
import { FullscreenModal } from '../common/modal';

const API_ENDPOINT_IMAGE = process.env.REACT_APP_API_ENDPOINT_IMAGE;

const CreateFunWrapper = styled.div`
	margin: 0 auto;
	padding: 25px 0px 10px 0;
	@media ${smallScreen} {
		min-height: ${(props) => `${props.height - 50}px`};
	}
	@media ${mediumScreen} {
		min-height: ${(props) => `${props.height - 77}px`};
	}
	width: -webkit-fill-available;
`;

const StyledBackground = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;

	@media ${smallScreen} {
		height: ${(props) => `${props.height - 170}px`} !important;
	}
	@media ${mediumScreen} {
		height: ${(props) => `${props.height - 200}px`} !important;
	}
`;

const StyledUploadButton = styled(Button)`
padding: 0px !important
	border-radius: 0 !important;
	border: none !important;
	background-color: #f7f7f7 !important;
	width: ${(props) =>
		`${
			props.width < props.height ? props.width : props.height
		}px`} !important;
	height: ${(props) =>
		`${
			props.width < props.height ? props.width : props.height
		}px`} !important;
	max-width: 400px !important;
	max-height: 400px !important;
	margin: 0px 25px !important;
	background-repeat: no-repeat !important;
	background-size: ${(props) =>
		props.image && props.image !== null ? 'cover' : '25%'} !important;
	// cover !important;
	background-position: ${(props) =>
		props.image && props.image !== null ? 'center' : '50% 40%'} !important;
	background-image: url(${(props) =>
		props.image && props.image !== null ? props.image : Camera}) !important;
`;

const StyledCreateFunButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.green} !important;
	padding: 15px !important;
	margin: 0px 5px !important;
	text-transform: uppercase !important;
	font-weight: 400 !important;
	background-color: ${colors.green}!important;
	@media ${smallScreen} {
		width: 100% !important;
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		width: 100% !important;
		font-size: 16px !important;
	}
`;

const StyledShareButton = styled(Button)`
	color: ${colors.white}!important;
	border: 1px solid ${colors.red} !important;
	padding: 15px !important;
	margin: 0px 5px !important;
	text-transform: uppercase !important;
	font-weight: 400 !important;
	background-color: ${colors.red}!important;
	@media ${smallScreen} {
		width: 100% !important;
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		width: 100% !important;
		font-size: 16px !important;
	}
`;

const StyledFooter = styled.div`
	padding: 0 25px;
	display: flex;
	flex-direction: row;
`;

const StyledCard = styled.div`
	display: flex;
	width: 100%;
	flex-direction: row;
	cursor: default;
	margin: 10px 0;
`;

const StyledCardImage = styled.div`
	@media ${smallScreen} {
		width: 50px;
		height: 50px;
	}
	@media ${mediumScreen} {
		width: 70px;
		height: 70px;
	}
	border-radius: 50%;
	background-color: ${colors.lightGray};
	background-image: url(${(props) => props.image}) !important;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin: auto 0;
`;

const StyledCardContent = styled.div`
	flex: 1;
	flex-direction: column;
	padding: 15px;
	margin: auto 0;
	text-align: left !important;
`;

const StyledCardName = styled.div`
	color: ${colors.darkGray};
	font-weight: 700;
	@media ${smallScreen} {
		font-size: 16px;
	}
	@media ${mediumScreen} {
		font-size: 18px;
	}
`;

const StyledCardStatus = styled.div`
	color: ${colors.gray};
	font-size: 14px;
`;

const StyledFriendList = styled.div`
	// background-color: red;
	width: -webkit-fill-available;
	min-height: -webkit-fill-available;
	padding: 15px 50px 30px 50px;
	height: 150px;
	overflow-y: scroll;
`;

const StyledCardBtns = styled.div`
	@media ${smallScreen} {
		width: 100px;
		height: 50px;
	}
	@media ${mediumScreen} {
		width: 140px;
		height: 70px;
	}
	margin: auto 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const StyledCheckbox = styled(Checkbox)`
	display: flex;
	align-self: flex-start;
	margin-left: 50px;
	&&&.ui.checkbox label,
	.ui.checkbox + label {
		color: #8a8989;
		font-weight: 700;
		@media ${smallScreen} {
			font-size: 14px !important;
		}
		@media ${mediumScreen} {
			font-size: 16px !important;
		}
	}
	&&&.ui.checkbox input:checked ~ .box:after,
	.ui.checkbox input:checked ~ label:after,
	.ui.checkbox .box:after {
		opacity: 1;
		color: #52cbbe;
	}
`;

const StyledLinkBtn = styled(Button)`
	color: ${colors.darkGray}!important;
	border: none !important;
	padding-top: 15px !important;
	margin: 0 auto !important;
	text-transform: capitalize !important;
	font-weight: 400 !important;
	background-color: transparent !important;
	text-decoration: underline !important;
	@media ${smallScreen} {
		width: 100% !important;
		font-size: 14px !important;
	}
	@media ${mediumScreen} {
		width: 100% !important;
		font-size: 16px !important;
	}
`;

const StyledTabPan = styled.div`
	padding: 0.92857143em 1.14285714em;
	border-radius: 4px 4px 4px 4px;
	background-color: #52cbbe !important;
	color: #ffffff !important;
	width: -webkit-fill-available;
	margin: 0 30px 20px 30px;
`;

const StyledSuccessMsg = styled.div`
	margin: auto;
	font-size: initial;
	color: #8a8989;
`;

const CreateFun = (props) => {
	const { height, width } = useWindowDimensions();
	const { closeAllPopups, setCloseAllPopups } = HomeContainer.useContainer();
	const { friends } = FriendsContainer.useContainer();
	const {
		handleOpenShareFreeGameModal,
		handleCloseModal,
		isModalVisible,
		modalType,
	} = useModal();

	const {
		isBusy,
		setIsBusy,
		photoFile,
		setPhotoFile,
		photoUrl,
		setPhotoUrl,
		handleSubmit,
		isGameCreated,
		setIsGameCreated,
		ids,
		setIds,
		checkAll,
		setCheckAll,
		handleShareGame,
		isGameShared,
		setIsGameShared,
		successMsg,
		setSuccessMsg,
		completedCrop,
		setCompletedCrop,
	} = CreateFunContainer.useContainer();

	const inputOpenFileRef = React.createRef();

	const [postVisible, setPostVisible] = useState(false);

	const [upImg, setUpImg] = useState();
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 / 1 });

	// Increase pixel density for crop preview quality on retina screens.
	const pixelRatio = window.devicePixelRatio || 1;

	// We resize the canvas down when saving on retina devices otherwise the image
	// will be double or triple the preview size.
	const getResizedCanvas = (canvas, newWidth, newHeight) => {
		const tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = newWidth;
		tmpCanvas.height = newHeight;

		const ctx = tmpCanvas.getContext('2d');
		ctx.drawImage(
			canvas,
			0,
			0,
			canvas.width,
			canvas.height,
			0,
			0,
			newWidth,
			newHeight
		);

		return tmpCanvas;
	};

	useEffect(() => {
		if (ids.length > 0) {
			setPostVisible(true);
		} else {
			setPostVisible(false);
		}
	}, [ids]);

	useEffect(() => {
		console.log(completedCrop);
	}, [completedCrop]);

	const generateDownload = (previewCanvas, crop) => {
		if (!crop || !previewCanvas) {
			return;
		}

		const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);

		canvas.toBlob(
			(blob) => {
				const previewUrl = window.URL.createObjectURL(blob);
				const url = canvas.toDataURL('image/png');

				var file = new File([blob], 'puzzle_image.png', {
					type: 'image/png',
					lastModified: new Date(),
				});

				setPhotoFile(file);
				setPhotoUrl(url);

				window.URL.revokeObjectURL(previewUrl);
			},
			'image/png',
			1
		);
	};

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', () => setUpImg(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current;
		const canvas = previewCanvasRef.current;
		const crop = completedCrop;

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = 'high';

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		if (
			completedCrop &&
			completedCrop.width > 0 &&
			completedCrop.height > 0
		) {
			generateDownload(canvas, completedCrop);
		} else {
			handleClearImage();
		}
	}, [completedCrop]);

	useEffect(() => {
		if (closeAllPopups === true) {
			setCloseAllPopups(false);
			props.handleCloseModal();
		}
	}, [closeAllPopups]);

	useEffect(() => {
		if (ids.length === friends.length) {
			setCheckAll(true);
		}
	}, [ids]);

	const handleClose = () => {
		setIsBusy(false);
		setPhotoFile();
		setPhotoUrl();
		setIsGameCreated(false);
		setCheckAll(false);
		setIds([]);
		setIsGameShared(false);
		setSuccessMsg();
		props.handleCloseModal();
	};

	const handleFile = (e) => {
		const file = e.target.files[0];
		setPhotoFile(file);
		const fileReader = new FileReader();
		if (file) {
			fileReader.readAsDataURL(file);
		}
		fileReader.onloadend = () => {
			setPhotoFile(file);
			setPhotoUrl(fileReader.result);
		};
	};

	const loadPhoto = (event) => {
		inputOpenFileRef.current.click();
	};

	const handleCreateGame = (e) => {
		handleSubmit(e);
	};

	const handleCheck = (e, data) => {
		setCheckAll(false);
		if (data.checked) {
			setIds((ids) => [...ids, data.value]);
		} else {
			setIds(ids.filter((id) => id !== data.value));
		}
	};

	const handleClearImage = () => {
		setPhotoFile();
		setPhotoUrl();
		setUpImg();
		setCompletedCrop(null);
	};

	const handleCheckAll = (e, data) => {
		if (data.checked) {
			setCheckAll(true);
			let idList = [];
			friends.forEach((value, index, array) => {
				idList.push(value.id);
			});
			setIds(idList);
		} else {
			setCheckAll(false);
			setIds([]);
		}
	};

	return (
		<Container>
			<NavHeader
				title={!isGameCreated ? 'Create Fun' : 'Share'}
				handleCloseModal={handleClose}
			/>
			<CreateFunWrapper height={height}>
				{!isGameCreated ? (
					<>
						<StyledBackground height={height}>
							{/* Create Game starts here */}
							<Form>
								<StyledUploadButton
									height={height - 50}
									width={width - 50}
								>
									<input
										type="file"
										name="file"
										id="file"
										accept="image/*"
										style={{ display: 'none' }}
										capture="camera"
										onChange={onSelectFile}
									></input>
									{!upImg ? (
										<label
											class="upload_label"
											style={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexDirection: 'column',
												paddingTop: 65,
											}}
											for="file"
										>
											{/* <Icon
												name="camera"
												size="big"
												style={{ margin: 20 }}
											/> */}
											Take Picture or Upload Image
										</label>
									) : null}

									<ReactCrop
										src={upImg}
										onImageLoaded={onLoad}
										crop={crop}
										onChange={(c) => setCrop(c)}
										onComplete={(c) => setCompletedCrop(c)}
										keepSelection
										style={{
											height: '100%',
										}}
									/>
								</StyledUploadButton>
								<div>
									<canvas
										ref={previewCanvasRef}
										// Rounding is important so the canvas width and height matches/is a multiple for sharpness.
										style={{
											width: Math.round(
												completedCrop
													? completedCrop.width
													: 0
											),
											height: Math.round(
												completedCrop
													? completedCrop.height
													: 0
											),
											display: 'none',
										}}
									/>
								</div>
							</Form>
							{photoUrl && photoUrl !== null ? (
								<StyledLinkBtn
									onClick={() => handleClearImage()}
									disabled={isBusy}
								>
									Clear
								</StyledLinkBtn>
							) : null}
						</StyledBackground>
						<StyledFooter>
							<StyledCreateFunButton
								onClick={(e) => handleCreateGame(e)}
								disabled={isBusy}
							>
								Create Fun
							</StyledCreateFunButton>
						</StyledFooter>
					</>
				) : !isGameShared ? (
					<>
						<StyledBackground height={height}>
							{/* Share starts here */}
							<StyledTabPan>FRIENDS</StyledTabPan>
							{friends && friends.length > 0 ? (
								<StyledCheckbox
									label="Select All"
									onChange={handleCheckAll}
									checked={checkAll}
								/>
							) : null}

							<StyledFriendList>
								{friends && friends.length > 0 ? (
									friends.map((friend) => (
										<StyledCard>
											<StyledCardImage
												image={
													friend.image
														? `${API_ENDPOINT_IMAGE}${friend.image}`
														: friend.socialImage ||
														  ProfileImg
												}
											/>
											<StyledCardContent>
												<StyledCardName>
													{friend.name}
												</StyledCardName>
											</StyledCardContent>
											<StyledCardBtns>
												<Checkbox
													value={friend.id}
													checked={
														checkAll ||
														ids.indexOf(
															friend.id
														) !== -1
													}
													onChange={handleCheck}
												/>
											</StyledCardBtns>
										</StyledCard>
									))
								) : (
									<StyledCardStatus>
										Oops, let's get some friends here. Use
										the SHARE button to get a few friends
										here.
									</StyledCardStatus>
								)}
							</StyledFriendList>
						</StyledBackground>
						<StyledFooter>
							<StyledCreateFunButton
								onClick={(e) => handleShareGame(e)}
								disabled={isBusy || postVisible}
							>
								Post
							</StyledCreateFunButton>
							<StyledShareButton
								onClick={handleOpenShareFreeGameModal}
								disabled={isBusy}
							>
								Share
							</StyledShareButton>
						</StyledFooter>
						<StyledLinkBtn onClick={() => handleClose()}>
							Later
						</StyledLinkBtn>
					</>
				) : (
					<>
						<StyledBackground height={height}>
							{/* After share starts here */}
							<StyledSuccessMsg>
								{isGameCreated &&
								isGameShared &&
								successMsg !== null
									? successMsg
									: 'Game was shared among your friends.'}
							</StyledSuccessMsg>
						</StyledBackground>
						<StyledFooter>
							<StyledCreateFunButton
								onClick={() => handleClose()}
								disabled={isBusy}
							>
								OK
							</StyledCreateFunButton>
							<StyledCreateFunButton
								onClick={handleOpenShareFreeGameModal}
								disabled={isBusy}
							>
								More
							</StyledCreateFunButton>
						</StyledFooter>
					</>
				)}
			</CreateFunWrapper>
			<FullscreenModal
				handleCloseModal={handleCloseModal}
				isModalVisible={isModalVisible}
				modalType={modalType}
			/>
		</Container>
	);
};

export default CreateFun;
