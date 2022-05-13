import React from 'react'
import { WithStore } from 'pure-react-carousel'

import HomeContainer from '../../containers/home.container'

const CarouselHOC = React.forwardRef((props, ref) => {
  const { setSlide } = HomeContainer.useContainer()
  setSlide(props.currentSlide)
  return null
});

export default WithStore(CarouselHOC, state => ({
  currentSlide: state.currentSlide
}));
