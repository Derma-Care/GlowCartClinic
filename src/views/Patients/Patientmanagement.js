import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CBadge ,CModalFooter 
} from '@coreui/react'
import { CustomerByClinicNdBranchId } from '../customerManagement/CustomerManagementAPI'
import { Eye,Edit2 ,Trash  } from 'lucide-react'
import axios from 'axios'
import { wifiUrl } from '../../baseUrl'

const PatientManagement = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
const [showModal, setShowModal] = useState(false);
const [selectedHistory, setSelectedHistory] = useState(null)
const [viewModal, setViewModal] = useState(false)

  const [visible, setVisible] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [history, setHistory] = useState([]) 
  const [responseMessage, setResponseMessage] = useState('')
  const [appointmentTab, setAppointmentTab] = useState('active')

  // 🔹 Fetch Patients List
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)
        const hospitalId = localStorage.getItem('HospitalId')
        const branchId = localStorage.getItem('branchId')
        const data = await CustomerByClinicNdBranchId(hospitalId, branchId)
        setPatients(data || [])
      } catch (err) {
        console.error('Error fetching patients:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  // 🔹 Fetch Appointments When Tab = 2 and Patient Selected
 


  // 🔹 API call for Appointments
  const fetchAppointments = async (patientId) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${wifiUrl}/api/customer/bookings/byPatientId/${patientId}`
      )
      console.log('Full API response:', response.data)
      const data = response.data?.data || []
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }


 const fetchVisitHistory = async (patientId) => {
  setLoading(true)
  try {
    const response = await axios.get(`${wifiUrl}/api/doctors/visitHistory/${patientId}`)
    console.log('Visit History Response:', response.data)
    // setResponseMessage(response.data?.message || '')
    const data = response.data?.data.visitHistory
    if (Array.isArray(data)) setHistory(data)
    else if (data && typeof data === 'object') setHistory([data])
    else setHistory([])
  } catch (error) {
    console.error('Error fetching visit history:', error)
    // setResponseMessage('Error fetching visit history')
    setHistory([])
  } finally {
    setLoading(false)
  }
}
 useEffect(() => {
    if (activeKey === 2 && selectedPatient?.patientId) {
      console.log('Fetching appointments for:', selectedPatient.patientId)
      fetchAppointments(selectedPatient.patientId)
    }
  }, [activeKey, selectedPatient])
  useEffect(() => {
  if (activeKey === 4 && selectedPatient?.patientId) {
    fetchVisitHistory(selectedPatient.patientId)
  }
}, [activeKey, selectedPatient])
// const AppointmentTabs = ({ loading, appointments, selectedPatient }) => {
//   const [appointmentTab, setAppointmentTab] = useState('active')

//   // Filter appointments based on sub-tab selection
//   const filteredAppointments = appointments?.filter((a) =>
//     a.status?.toLowerCase().includes(appointmentTab)
//   )



  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardBody>
          {/* Tabs */}
          <CNav variant="tabs" role="tablist" style={{cursor: 'pointer'}}>
            <CNavItem>
              <CNavLink
                active={activeKey === 1}
                onClick={() => setActiveKey(1)}
                style={{ color: 'var(--color-black)' }}
              >
                Patient Info
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeKey === 2}
                onClick={() => selectedPatient && setActiveKey(2)}
                disabled={!selectedPatient}
                style={{ color: 'var(--color-black)' }}
              >
                Appointments
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeKey === 3}
                onClick={() => selectedPatient && setActiveKey(3)}
                disabled={!selectedPatient}
                style={{ color: 'var(--color-black)' }}
              >
                Reports
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeKey === 4}
                onClick={() => selectedPatient && setActiveKey(4)}
                disabled={!selectedPatient}
                style={{ color: 'var(--color-black)' }}
              >
                History
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent className="mt-3">
            {/* 🔹 Patient Info Tab */}
            <CTabPane role="tabpanel" visible={activeKey === 1}>
              {loading ? (
                <div className="text-center py-3">
                  <CSpinner color="primary" /> Loading...
                </div>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <CTable >
                  <CTableHead className="pink-table w-auto">
                    <CTableRow>
                      <CTableHeaderCell>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Patient ID</CTableHeaderCell>
                      <CTableHeaderCell>Full Name</CTableHeaderCell>
                      <CTableHeaderCell>Age</CTableHeaderCell>
                      <CTableHeaderCell>Gender</CTableHeaderCell>
                      <CTableHeaderCell>Mobile Number</CTableHeaderCell>
                      <CTableHeaderCell>City</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody className="pink-table">
                    {patients.length > 0 ? (
                      patients.map((p, index) => (
                        <CTableRow key={p.patientId || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>

                          {/* Patient ID as clickable link */}
                          <CTableDataCell>
                            <span
                              style={{
                                color: '#007bff',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setSelectedPatient(p)
                                setActiveKey(2) // Navigate to appointments tab
                              }}
                            >
                              {p.patientId}
                            </span>
                          </CTableDataCell>

                          <CTableDataCell>{p.fullName || '-'}</CTableDataCell>
                          <CTableDataCell>{p.age || '-'}</CTableDataCell>
                          <CTableDataCell>{p.gender || '-'}</CTableDataCell>
                          <CTableDataCell>{p.mobileNumber || '-'}</CTableDataCell>
                          <CTableDataCell>{p.address?.city || '-'}</CTableDataCell>

                          <CTableDataCell className="text-end">
                          <div className="d-flex gap-2">
  {/* View Button */}
  <CButton
    color="info"
    size="sm"
    className="actionBtn"
    style={{ color: 'var(--color-black)' }}
    onClick={() => {
      setSelectedPatient(p)
      setVisible(true)
    }}
  >
    <Eye size={18} />
  </CButton>

  {/* Edit Button */}
  <CButton
    color="info"
    size="sm"
     style={{ color: 'var(--color-black)' }}
    className="actionBtn"
    onClick={() => handleEdit(p)}
  >
    <Edit2 size={18} />
  </CButton>

  {/* Delete Button */}
  <CButton
    color="info"
    size="sm"
    className="actionBtn"
     style={{ color: 'var(--color-black)' }}
    onClick={() => handleDelete(p.patientId)}
  >
    <Trash size={18} />
  </CButton>
</div>

                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center text-muted">
                          No patient records found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CTabPane>

           
       {/* 🔹 Appointments Tab */}
<CTabPane visible={activeKey === 2}>
  {loading ? (
    <div className="text-center py-4">
      <CSpinner color="primary" />
    </div>
  ) : appointments && appointments.length > 0 ? (
    <>
      <h5 className="mb-3">
        Appointments for {selectedPatient?.fullName} ({selectedPatient?.patientId})
      </h5>

      {/* 🔹 Sub-tabs for Active | Pending | Completed */}
      <CNav variant="tabs" role="tablist" className="mb-3" style={{cursor:'pointer'}} >
        <CNavItem>
          <CNavLink   style={{ color: 'var(--color-black)' }}
            active={appointmentTab === 'active'}
            onClick={() => setAppointmentTab('active')}
          >
            Active
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink   style={{ color: 'var(--color-black)' }}
            active={appointmentTab === 'pending'}
            onClick={() => setAppointmentTab('pending')}
          >
            Pending
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink   style={{ color: 'var(--color-black)' }}
            active={appointmentTab === 'completed'}
            onClick={() => setAppointmentTab('completed')}
          >
            Completed
          </CNavLink>
        </CNavItem>
      </CNav>

      {(() => {
        // 🧩 Filter based on sub-tab selection
        const filteredAppointments = appointments.filter((a) => {
          const status = a.status?.toLowerCase() || '';
          if (appointmentTab === 'active')
            return status === 'active' || status === 'in-progress';
          if (appointmentTab === 'pending') return status === 'pending';
          if (appointmentTab === 'completed') return status === 'completed';
          return true;
        });

        return filteredAppointments.length > 0 ? (
          <CTable >
            <CTableHead className="pink-table w-auto">
              <CTableRow>
                <CTableHeaderCell>S.No</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Doctor</CTableHeaderCell>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Consultation Type</CTableHeaderCell>
                <CTableHeaderCell>Service</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody className="pink-table">
              {filteredAppointments.map((a, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>{i + 1}</CTableDataCell>
                  <CTableDataCell>{a.serviceDate || '-'}</CTableDataCell>
                  <CTableDataCell>{a.doctorName || '-'}</CTableDataCell>
                  <CTableDataCell>{a.branchname || '-'}</CTableDataCell>
                  <CTableDataCell>
                  <CBadge
  color="light"
  style={{
    color: 'var(--color-black)', // your text color
  }}
  className="fw-semibold text-uppercase"
>
  {a.status || '-'}
</CBadge>


                  </CTableDataCell>
                  <CTableDataCell>{a.consultationType || '-'}</CTableDataCell>
                  <CTableDataCell>{a.subServiceName || '-'}</CTableDataCell>

                  {/* 🔹 View Icon Button */}
                  <CTableDataCell className="text-end">
                   <CButton
                   color="info"
                              size="sm"
                              className="actionBtn"
                               style={{ color: 'var(--color-black)' }}
  onClick={() => {
    setSelectedAppointment(a); // 'appointment' is the current item
    setShowModal(true);
  }}
>
     <Eye size={18} />
</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p className="text-center py-3">
            No {appointmentTab} appointments found for{' '}
            {selectedPatient?.fullName}.
          </p>
        );
      })()}
    </>
  ) : (
    <p className="text-center py-3">
      No appointments found for {selectedPatient?.fullName}.
    </p>
  )}
</CTabPane>





            {/* 🔹 Reports Tab (for future use) */}
 <CTabPane visible={activeKey === 4}>
  {loading ? (
    <div className="text-center py-4">
      <CSpinner color="primary" />
    </div>
  ) : history.length > 0 ? (
    <>
      <h5 className="mb-3" style={{ color: 'var(--color-black)' }}>
        Visit History for {selectedPatient?.fullName} ({selectedPatient?.patientId})
      </h5>

      <CTable hover responsive bordered>
        <CTableHead className="pink-table w-auto">
          <CTableRow>
            <CTableHeaderCell>S.No</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Doctor</CTableHeaderCell>
            <CTableHeaderCell>Visit Type</CTableHeaderCell>
            <CTableHeaderCell>Diagnosis</CTableHeaderCell>
            <CTableHeaderCell>Treatment</CTableHeaderCell>
            <CTableHeaderCell>Follow-up Date</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell> {/* 👈 Added column */}
          </CTableRow>
        </CTableHead>

        <CTableBody className="pink-table">
          {history.map((h, i) => (
            <CTableRow key={h.id || i}>
              <CTableDataCell>{i + 1}</CTableDataCell>
              <CTableDataCell>
                {h.visitDateTime
                  ? new Date(h.visitDateTime).toLocaleDateString()
                  : '-'}
              </CTableDataCell>
              <CTableDataCell>{h.doctorName || '-'}</CTableDataCell>
              <CTableDataCell>{h.visitType || '-'}</CTableDataCell>
              <CTableDataCell>{h.symptoms?.diagnosis || '-'}</CTableDataCell>
              <CTableDataCell>
                {h.treatments?.generatedData
                  ? Object.keys(h.treatments.generatedData).join(', ')
                  : '-'}
              </CTableDataCell>
              <CTableDataCell>
                {h.followUp?.nextFollowUpDate || '-'}
              </CTableDataCell>

              {/* View Button */}
              <CTableDataCell className="text-center">
                 <CButton
                  color="info"
                  size="sm"
                  className="actionBtn"
                  style={{ color: 'var(--color-black)' }}
                  onClick={() => {
                    setSelectedHistory(h)
                    setViewModal(true)
                  }}
                >
                  <Eye size={18} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  ) : (
    <p className="text-center py-3">
      {responseMessage ||
        `No visit history found for ${selectedPatient?.fullName}`}
    </p>
  )}
</CTabPane>






            {/* 🔹 History Tab (for future use) */}
            {/* <CTabPane visible={activeKey === 4}>
              <p className="text-center py-4">
                History for {selectedPatient?.fullName || 'Patient not selected'} will
                appear here.
              </p>
            </CTabPane> */}
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* 🔹 Modal for Patient Details */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Patient Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPatient ? (
            <div className="p-2">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <strong>Patient ID:</strong> {selectedPatient.patientId}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Customer ID:</strong> {selectedPatient.customerId}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Full Name:</strong> {selectedPatient.fullName}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Gender:</strong> {selectedPatient.gender}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Age:</strong> {selectedPatient.age}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Mobile:</strong> {selectedPatient.mobileNumber}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Email:</strong> {selectedPatient.email || 'N/A'}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Branch ID:</strong> {selectedPatient.branchId}
                </div>
              </div>

              <h6 className="fw-bold mt-3">Address</h6>
              <div className="border rounded p-2 bg-light">
                <p className="mb-1">
                  {selectedPatient.address?.houseNo}, {selectedPatient.address?.street}
                </p>
                <p className="mb-1">
                  {selectedPatient.address?.landmark}, {selectedPatient.address?.city}
                </p>
                <p className="mb-0">
                  {selectedPatient.address?.state}, {selectedPatient.address?.country} -{' '}
                  {selectedPatient.address?.postalCode}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted">No patient details available</p>
          )}
        </CModalBody>
      </CModal>
    <CModal visible={showModal} onClose={() => setViewModal(false)}>
  <CModalHeader>
    <h5>Booking Details</h5>
  </CModalHeader>
  <CModalBody>
    {selectedAppointment && (
      <div>
        {/* <h5 style={{ color: 'var(--color-black)' }}>Patient Information</h5>
        <p><b>Name:</b> {selectedAppointment.name}</p>
        <p><b>Patient ID:</b> {selectedAppointment.patientId}</p>
        <p><b>Mobile:</b> {selectedAppointment.patientMobileNumber}</p>
        <p><b>Age:</b> {selectedAppointment.age}</p>
        <p><b>Gender:</b> {selectedAppointment.gender}</p>
        <p><b>Address:</b> {selectedAppointment.patientAddress}</p>

        <hr /> */}
        {/* <h5  style={{ color: 'var(--color-black)' }}>Doctor & Clinic</h5>
        <p><b>Doctor:</b> {selectedAppointment.doctorName}</p>
        <p><b>Clinic:</b> {selectedAppointment.clinicName}</p>
        <p><b>Branch:</b> {selectedAppointment.branchname}</p>

        <hr /> */}
        {/* <h5  style={{ color: 'var(--color-black)' }}>Booking Details</h5> */}
        <p><b>Booking ID:</b> {selectedAppointment.bookingId}</p>
        <p><b>Service:</b> {selectedAppointment.subServiceName}</p>
        <p><b>Date:</b> {selectedAppointment.serviceDate}</p>
        <p><b>Time:</b> {selectedAppointment.servicetime}</p>
        <p><b>Status:</b> {selectedAppointment.status}</p>
        <p><b>Consultation Type:</b> {selectedAppointment.consultationType}</p>
        <p><b>Consultation Fee:</b> ₹{selectedAppointment.consultationFee}</p>
        <p><b>Total Fee:</b> ₹{selectedAppointment.totalFee}</p>
        <p><b>Free Follow-Ups Left:</b> {selectedAppointment.freeFollowUpsLeft}</p>

        {/* <hr /> */}
        {/* <h6  style={{ color: 'var(--color-black)' }}>Prescription Files</h6>


{selectedAppointment?.prescriptionPdf ? (
  Array.isArray(selectedAppointment.prescriptionPdf) &&
  selectedAppointment.prescriptionPdf.length > 0 ? (
    selectedAppointment.prescriptionPdf.map((pdf, index) => (
      <div key={index} className="mb-2">
        <a
          href={`data:application/pdf;base64,${pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          View Prescription {index + 1}
        </a>
      </div>
    ))
  ) : (
    <div className="mb-2">
      <a
        href={`data:application/pdf;base64,${selectedAppointment.prescriptionPdf}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
      >
        View Prescription
      </a>
    </div>
  )
) : (
  <p style={{ color: 'gray' }}>No prescription files available</p>
)} */}


      </div>
    )}
  </CModalBody>
  <CModalFooter>
    {/* <CButton color="secondary" onClick={() => setViewModal(false)}>
      Close
    </CButton> */}
  </CModalFooter>
</CModal>
<CModal visible={viewModal} onClose={() => setViewModal(false)}>
  <CModalHeader  style={{color: 'var(--color-black)',fontSize:'20px', fontWeight:'bold'}} >Visit Details</CModalHeader>
  <CModalBody>
    {/* --- Basic Info --- */}
     <h5 className='mb-3'>Basic Info </h5>
    <p><strong>Date:</strong> {selectedHistory?.visitDateTime ? new Date(selectedHistory.visitDateTime).toLocaleDateString() : '-'}</p>
    <p><strong>Doctor:</strong> {selectedHistory?.doctorName || '-'}</p>
    <p><strong>Clinic Name:</strong> {selectedHistory?.clinicName || '-'}</p>
    <p><strong>Booking ID:</strong> {selectedHistory?.bookingId || '-'}</p>

    <hr />

    {/* --- Symptoms Section --- */}
    <h5 className='mb-3'>Symptoms</h5>
    <p><strong>Details:</strong> {selectedHistory?.symptoms?.symptomDetails || '-'}</p>
    <p><strong>Doctor Observation:</strong> {selectedHistory?.symptoms?.doctorObs || '-'}</p>
    <p><strong>Diagnosis:</strong> {selectedHistory?.symptoms?.diagnosis || '-'}</p>
    <p><strong>Duration:</strong> {selectedHistory?.symptoms?.duration || '-'}</p>

    <hr />

    {/* --- Tests Section --- */}
    <h5 className='mb-3'>Tests</h5>
    {selectedHistory?.tests?.selectedTests?.length > 0 ? (
      <ul>
        {selectedHistory.tests.selectedTests.map((test, i) => (
          <li key={i} style={{color: 'var(--color-black)'}}>{test}</li>
        ))}
      </ul>
    ) : (
      <p>No tests found</p>
    )}

    <hr />

    {/* --- Treatment Section --- */}
    <h5 className='mb-3'>Treatments</h5>
    {selectedHistory?.treatments?.generatedData ? (
      Object.entries(selectedHistory.treatments.generatedData).map(([treatmentName, details], i) => (
        <div key={i}>
          <p><strong>Treatment:</strong> {treatmentName}</p>
          <p><strong>Frequency:</strong> {details.frequency || '-'}</p>
          <p><strong>Total Sittings:</strong> {details.totalSittings || '-'}</p>
          <p><strong>Pending Sittings:</strong> {details.pendingSittings || '-'}</p>
          <p><strong>Current Sitting:</strong> {details.currentSitting || '-'}</p>
          <p><strong>Completed Sittings:</strong> {details.takenSittings || '-'}</p>




          {details?.dates?.length > 0 && (
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{color: 'var(--color-black)'}} >Date</CTableHeaderCell>
                  <CTableHeaderCell style={{color: 'var(--color-black)'}}>Sitting</CTableHeaderCell>
                  <CTableHeaderCell style={{color: 'var(--color-black)'}}>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {details.dates.map((d, idx) => (
                  <CTableRow key={idx}>
                 <CTableDataCell style={{ color: 'var(--color-black)' }}>
  {d.date ? new Date(d.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) : '-'}
</CTableDataCell>

                    <CTableDataCell  style={{color: 'var(--color-black)'}} >{d.sitting}</CTableDataCell>
                    <CTableDataCell  style={{color: 'var(--color-black)'}} >{d.status}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </div>
      ))
    ) : (
      <p>No treatments found</p>
    )}

    <hr />

    {/* --- Follow-up Section --- */}
    <h5 className='mb-3'>Follow-Up</h5>
    <p><strong>Next Follow-Up:</strong> {selectedHistory?.followUp?.nextFollowUpDate || '-'}</p>
    <p><strong>Duration:</strong> {selectedHistory?.followUp?.durationValue ? `${selectedHistory.followUp.durationValue} ${selectedHistory.followUp.durationUnit}` : '-'}</p>
    <p><strong>Note:</strong> {selectedHistory?.followUp?.followUpNote || '-'}</p>

    <hr />

    {/* --- Prescription Section --- */}
    <h5 className='mb-3'>Prescription</h5>
    {selectedHistory?.prescription?.medicines?.length > 0 ? (
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Name</CTableHeaderCell>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Dose</CTableHeaderCell>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Duration</CTableHeaderCell>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Food</CTableHeaderCell>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Type</CTableHeaderCell>
            <CTableHeaderCell  style={{color: 'var(--color-black)'}} >Times</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {selectedHistory.prescription.medicines.map((m, i) => (
            <CTableRow key={i}>
              <CTableDataCell  style={{color: 'var(--color-black)'}} >{m.name}</CTableDataCell>
              <CTableDataCell  style={{color: 'var(--color-black)'}} >{m.dose}</CTableDataCell>
              <CTableDataCell  style={{color: 'var(--color-black)'}} >{m.duration} {m.durationUnit}</CTableDataCell>
              <CTableDataCell style={{color: 'var(--color-black)'}} >{m.food}</CTableDataCell>
              <CTableDataCell style={{color: 'var(--color-black)'}} >{m.medicineType}</CTableDataCell>
              <CTableDataCell style={{color: 'var(--color-black)'}} >{m.times?.join(', ')}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    ) : (
      <p>No prescription details found</p>
    )}

    {/* --- Prescription PDF --- */}
    {selectedHistory?.prescriptionPdf?.length > 0 && (
      <>
        <hr />
        <h6>Prescription PDF</h6>
        <iframe
          title="Prescription PDF"
          src={`data:application/pdf;base64,${selectedHistory.prescriptionPdf[0]}`}
          width="100%"
          height="500px"
          style={{ border: '1px solid #ccc', borderRadius: '6px' }}
        />
      </>
    )}
  </CModalBody>
</CModal>




    </div>
  )
}

export default PatientManagement

