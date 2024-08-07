import '../../CSS/InfoBar.css';

export default function InfoBar({roomName}) {
    return (
        <div className="InfoBar">
            <h2> {roomName}입니다 </h2>
        </div>
    )
}