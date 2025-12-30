import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { useNavigation } from '../Usecontext/NavigationProvider'
import { showCustomToast } from '../../Utils/Toaster'
import { useHospital } from '../Usecontext/HospitalContext'

const BackButton = ({ initialStatus = true }) => {
  const { goBack } = useNavigation()
  const [isOnline, setIsOnline] = useState(initialStatus)

  const { selectedHospital } = useHospital()
  const toggleStatus = () => {
    let clinicId = localStorage.getItem('HospitalId')
    const hospitalId = localStorage.getItem('HospitalId')
    console.log(selectedHospital)
    console.log(hospitalId)
    // showCustomToast('clinicId', selectedHospital.clinicId)
    const newStatus = !isOnline
    setIsOnline(newStatus)

    const statusText = newStatus ? '🟢 Clinic is now online' : '🔴 Clinic is now offline'

    showCustomToast(statusText) // ✅ proper text
    console.log('Clinic Status:', newStatus) // true / false
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* ✅ Online / Offline Toggle */}
      <div
        onClick={toggleStatus}
        style={{
          position: 'relative',
          width: '80px',
          height: '35px',
          borderRadius: '24px',
          backgroundColor: isOnline ? '#2ecc71' : '#e74c3c',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
        }}
      >
        {/* Label */}
        <span
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: '12px',
            marginLeft: isOnline ? '0' : '20px',
            transition: 'margin 0.3s ease',
            zIndex: 1,
          }}
        >
          {isOnline ? 'Online' : 'Offline'}
        </span>

        {/* Knob */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: isOnline ? '51px' : '4px',
            width: '25px',
            height: '25px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            transition: 'left 0.3s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* ✅ Back Button – matched height */}
      <CButton
        onClick={goBack}
        style={{
          height: '44px',
          padding: '0 22px',
          borderRadius: '10px',
          fontWeight: '500',
          borderColor: '#7e57c2',
          color: '#7e57c2',
        }}
        variant="outline"
      >
        Back
      </CButton>
    </div>
  )
}

export default BackButton

// const toggleStatus = async () => {

// const newStatus = !isOnline
// setIsOnline(newStatus) // Optimistic UI
// setLoading(true)

// try {
//   await axios.post('/api/clinic/update-status', {
//     clinicId,
//     isOnline: newStatus, // ✅ true / false sent to backend
//   })
// } catch (error) {
//   console.error('Failed to update clinic status', error)
//   setIsOnline(!newStatus) // ❌ revert if API fails
//   alert('Failed to update clinic status')
// } finally {
//   setLoading(false)
// }
// }
