import { useNavigate } from "react-router-dom"

export default function NoHost() {

  const navigate = useNavigate()

  const onClick = () => {
    navigate('/')
  }

  return (
    <div id='main-wrapper'>
      <div id='restart-screen-wrapper'>
        <div id='restart-screen' className='button' onClick={onClick}>
          <p>The host has left!</p>
        </div>
      </div>
    </div>
  )
}
