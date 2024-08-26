import '../../CSS/InfoBar.css';

export default function InfoBar({roomName}) {
    return (
        <div className="InfoBar">
            <h3> {roomName} </h3>
            <div className='barsearch'></div>
            <div className='line'></div>
        </div>
    )
}