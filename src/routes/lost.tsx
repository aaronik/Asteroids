import { useNavigate } from "react-router-dom"

export default function Lost() {

  const navigate = useNavigate()

  const onClick = () => {
    navigate('/')
  }

  return (
    <div id='main-wrapper'>
      <div id='restart-screen-wrapper'>
        <div id='restart-screen' className='button' onClick={onClick}>
          <p>Try getting better.</p>
        </div>
      </div>
    </div>
  )
}

