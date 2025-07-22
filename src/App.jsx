import Generator from './Generator'
// import CssMatcher from './Generator/CssMatcher'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import './components/Tooltip.scss'
import { AppProvider } from './contexts/AppContext.jsx';
import { GeneratorProvider } from './contexts/GeneratorContext';

function App() {
  return (
    <AppProvider>
      <GeneratorProvider>
        {/* <CssMatcher /> */}
        <Generator />
        <Tooltip id="global-tooltip" effect="solid" />
      </GeneratorProvider>
    </AppProvider>
  )
}

export default App
