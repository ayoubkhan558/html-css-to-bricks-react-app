import Generator from './Generator'
// import CssMatcher from './Generator/CssMatcher'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import './components/Tooltip.scss'
import { AppProvider } from './contexts/AppContext.jsx';

function App() {
  return (
    <AppProvider>
      {/* <CssMatcher /> */}
      <Generator />
      <Tooltip id="global-tooltip" effect="solid" />
    </AppProvider>
  )
}

export default App
