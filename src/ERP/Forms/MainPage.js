import React from 'react';
import ProductForm from '../Forms/ProductForm'
import ReactDOM from 'react-dom';
import LeftMenuBar from '../UIComponents/LeftMenuBar';

class MainPage extends React.Component {
    cancelPos = () => {
        ReactDOM.render(
            <ProductForm />,
            document.getElementById('root')
        );
    }

    render() {

        return (
            <div>
                <div className='leftMenu' id="leftMenu" >
                    <LeftMenuBar/>
                </div>
                <div className='mainArea' id="main" ></div>
            </div>
        );
    }
}
export default MainPage;