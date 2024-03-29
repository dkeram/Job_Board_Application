import React, {useState, useEffect} from 'react';
import ApplicationUpdate from './ApplicationUpdate';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from './AuthContext';


function UserProfile(props){
    const {token, id, role} = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState();

    const fetchJobs = async()=> {
        try{
            const jobData = await axios.get(`http://localhost:8000/my_jobs/${id}`,{headers: {Authorization :`Bearer ${token}`},});
            setJobs(jobData.data);
        }catch(error){
            console.error('Error fetching jobs', error);
        }
    };
    
    const handleDelete = async(jobId)=> {
        try{
            await axios.delete(`http://localhost:8000/jobs/${jobId}`,{headers: {Authorization :`Bearer ${token}`},});
        }catch(error){
            console.error('Error Deleting Job: ', error);
        }
    };
    
    const fetchApplications = async()=> {
        try{
            const applicationData = await axios.get(`http://localhost:8000/my_applications/${id}`,{headers: {Authorization :`Bearer ${token}`},});
            setApplications(applicationData.data);
        }catch(error){
            console.error('Error fetching Applications', error);
        }
    };    
    
    const handleJobClick = async(jobId) =>{
        if(selectedJob === jobId){
            setSelectedJob(null);
        }else{
            setSelectedJob(jobId);
            const selectedApplications = await axios.get(`http://localhost:8000/view_applications/${jobId}`,{headers: {Authorization :`Bearer ${token}`},});
            setApplications(selectedApplications.data);
            
        };
    };

    useEffect(()=>{
        fetchJobs();
        fetchApplications();
    }, []);
    
    
    return(
        <div className="container-sm">
            {role=== 'Employer' ?
                <div>
                    <h2>My Jobs</h2>
                        <ol className="list-group">
                            {jobs.map((job)=>
                                <li key= {job.id} className='list-group-item'>
                                    <div className="d-flex justify-content-between align-items-center">
                                    <span 
                                        onClick = {()=> {handleJobClick(job.id)}}
                                        style = {{cursor: "pointer" }}>
                                            <b> {job.title} </b>
                                    </span>
                                    <button className="btn btn-danger" onClick={() => handleDelete(job.id) }>Delete</button>
                                    </div>
                                    {selectedJob === job.id && (
                                        applications.map((application)=>
                                            (
                                                <div className="mt-3">
                                                    <ul>
                                                        <li>
                                                            <strong>Applicant:</strong>
                                                            <p dangerouslySetInnerHTML={{ __html: application.applicant.username.replace(/\n/g, '<br />') }}></p>
                                                            <strong>Cover Letter:</strong>
                                                            <p dangerouslySetInnerHTML={{ __html: application.cover_letter.replace(/\n/g, '<br />') }}></p>
                                                            <strong>Date Posted:</strong>
                                                            <p dangerouslySetInnerHTML={{ __html: job.date_posted.replace(/\n/g, '<br />') }}></p>
                                                            <ApplicationUpdate job_listing = {job.id} applicant = {application.applicant.id} application_id = {application.id} application_cl = {application.cover_letter}/>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))
                                    )}
                                </li>
                            )}
                        </ol>
                </div>
                :
                <div className="container-sm">
                    <h2>My Applications</h2>
                        <ul className="list-group">
                        {applications.map((application)=>
                            <li key= {application.id} className='list-group-item'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                    <strong>Job Title:</strong>
                                    <p>{application.job_listing.title}</p>
                                    </span>
                                    <span>
                                    <strong>Status:</strong>
                                        {application.status.status === "Accepted" ? <p class="alert alert-success" role="alert">{application.status.status}</p>
                                        :<>
                                            {application.status.status === "Rejected" ? <p class="alert alert-danger" role="alert">{application.status.status}</p>
                                            :
                                            <p class="alert alert-info" role="alert">{application.status.status}</p>
                                            }
                                        </>
                                        }
                                    </span>
                                </div>
                            </li>
                            )}
                        </ul>
                </div>
            }
            <br></br>
                        <div>
                            <Link to="/"><button class="btn btn-primary">Back</button></Link>
                        </div>
        </div>
    );
};

export default UserProfile;