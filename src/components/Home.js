
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <div>
                <h2>Reconhecimento Facial</h2>
                <li>
                    <Link to="/photo">Reconhecimento por foto</Link>
                </li>
                <li>
                    <Link to="/camera">Reconhecimento por camera</Link>
                </li>
        </div>
    )
}

export default Home;

        