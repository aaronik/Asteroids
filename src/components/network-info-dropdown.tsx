import type Network from '@browser-network/network'
import { useEffect, useState } from 'react'

// Some nice arrows I might want to use in the future:
// ⟵   ⟶

const IconSvg = ({ style }: { style: React.CSSProperties }) => {
  const containerStyle = Object.assign({
    width: '30px',
    heigh: '30px'
  }, style)

  const pathStyle = {
    fill: 'none',
    stroke: '#FFF',
    'stroke-width': 1,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-miterlimit': 1
  }

  return (
    <svg version="1.1" style={containerStyle} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32" >
      <line style={pathStyle} x1="16" y1="17" x2="16" y2="20" />
      <polyline style={pathStyle} points="14,21 16,19.8 18,21 " />
      <path style={pathStyle} d="M17.3,8.6c0,1,0.6,1.8,1.6,2.1c1.1,0.3,1.9,1.2,2.2,2.3l-10,0c0.2-1.1,1.1-2,2.1-2.3c0.9-0.3,1.6-1.1,1.6-2.1v0
	"/>
      <path style={pathStyle} d="M16,9L16,9c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v2C18,8.1,17.1,9,16,9z" />
      <path style={pathStyle} d="M25.3,24.6c0,1,0.6,1.8,1.6,2.1c1.1,0.3,1.9,1.2,2.2,2.3l-10,0c0.2-1.1,1.1-2,2.1-2.3c0.9-0.3,1.6-1.1,1.6-2.1
	v0"/>
      <path style={pathStyle} d="M24,25L24,25c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v2C26,24.1,25.1,25,24,25z" />
      <path style={pathStyle} d="M9.3,24.6c0,1,0.6,1.8,1.6,2.1c1.1,0.3,1.9,1.2,2.2,2.3L3,29c0.2-1.1,1.1-2,2.1-2.3c0.9-0.3,1.6-1.1,1.6-2.1v0"
      />
      <path style={pathStyle} d="M8,25L8,25c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v2C10,24.1,9.1,25,8,25z" />
    </svg>
  )
}

type NetworkInfoDropdownProps = {
  network: Network,
  styleOverrides?: React.CSSProperties
}

export default function NetworkInfoDropdown(props: NetworkInfoDropdownProps) {
  const { network, styleOverrides } = props

  const [numConnections, setNumConnections] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    network.on('add-connection', () => setNumConnections(network.activeConnections().length))
    network.on('destroy-connection', () => setNumConnections(network.activeConnections().length))
  }, [])

  const dropdownStyle = Object.assign({
    position: 'absolute',
    right: '1vw',
    top: '1vw',
    borderRadius: '20px',
    backgroundColor: 'dimgrey',
    opacity: '0.5',
    // cursor: 'pointer',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  } as const, styleOverrides)

  return (
    <div style={dropdownStyle} onClick={() => setIsOpen(!isOpen)}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <IconSvg style={{ marginRight: '3px' }} />
        <code> | {numConnections}</code>
      </div>
      <div style={{ display: isOpen ? 'block' : 'none' }}>
        <hr/>
        <code><a target='_blank' href='https://github.com/browser-network/network#readme'>Browser Network</a></code>
        <hr/>
        <code>us: {network.address.slice(0, 7) + '...'}</code>
        <hr/>
        <code>connections:</code>
        {network.activeConnections().map((con) => {
          return <code style={{ display: 'block' }} key={con.id}>{con.address?.slice(0, 11) + '...'}</code>
        })}
      </div>
    </div>
  )
}
