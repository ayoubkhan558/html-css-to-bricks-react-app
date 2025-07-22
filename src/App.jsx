
import Generator from './Generator'
import CssMatcher from './Generator/CssMatcher'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import './components/Tooltip.scss'

function App() {
  return (
    <>
      {/* <CssMatcher /> */}
      <Generator />
      <Tooltip id="global-tooltip" effect="solid" />
    </>
  )
}

export default App
