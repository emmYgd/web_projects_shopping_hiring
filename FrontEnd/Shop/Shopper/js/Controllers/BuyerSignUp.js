import AbstractModel from "./../Models/AbstractModel.js";
	
	//since vue-js is not working, I will use the jquery library to update:
	let UpdateGeneral = 
	{	
		currentInternID: window.localStorage.getItem('currentInternID'),
		internFirstName:$('#internFirstName').val(),
		internLastName: $('#internLastName').val(),
		internUsername:$('#internUsername').val(),
		internEmail:$('#internEmail').val(),
		internPhoneNumber: $('#internPhoneNumber').val(),
		internGender: $('#internGender').val(),
		internAge: $('#internAge').val(),
		internOccupation: $('#internOccupation').val(),
		internLocation: $('#internAge').val(),
		internAddress: $('#internAddress').val(),
		internInstitution: $('#internInstitution').val(),
		internCourseOfStudy: $('#internCourseOfStudy').val(),
		internYearOrLevel: $('#internYearOrLevel').val(),
		internSchoolGrade: $('#internSchoolGrade').val(),
		internYearsOfExperience: $('#internYearsOfExperience').val(),
		internPreferredJobLocation: $('#internPreferredJobLocation').val(),
		
		serverSyncModel:null,
		
		clicked_state:false,
		update_success:false,
		
		methods:{
			
			SyncSubmitUpdateModel: function()
			{
				/*let method = "POST";
				let updateServerUrl = 'http://localhost/InternsHire/Backend/public/api/v1/interns/dashboard/utils/update/intern/details';
				
				//prepare the JSON model:
				let jsonRequestModel = 
				{
					'intern_id' : this.currentInternID,
					'firstname' : this.internFirstName,
					'lastname' : this.internLastName,
					'username' : this.internUsername,
					'email' : this.internEmail,
					'phone_number': this.internPhoneNumber,
					'gender': this.internGender,
					'age': this.internAge,
					'occupation': this.internOccupation,
					'location': this.internLocation,
					'address': this.internAddress,
					'institution' : this.internInstitution,
					'course_of_study':this.internCourseOfStudy,
					'year_or_level'  : this.internYearOrLevel,
					'grade': this.internSchoolGrade,
					'years_of_experience': this.internYearsOfExperience,
					'preferred_job_location': this.internPreferredJobLocation,
				}
				let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
				console.log(serverModel);
				this.serverSyncModel = serverModel*/
				console.log("Hello Sync Method!")
			},
		
			SubmitUpdate(targetClickElem)
			{
				$(targetClickElem).click(function(event)
				{
					event.preventDefault();
					
					console.log('Current, This ID',this.currentInternID);
					
					//set state to true for watchers
					this.clicked_state = true;
					
					//call the server sync:
					this.methods.SyncSubmitUpdateModel();
					
					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'UpdateSuccess!')
					)
					{
						//update state:
						this.update_success = true;
						//call reactors:
						this.reactors.UpdateUIsuccess()
					}
					else if
					( 
						(this.serverSyncModel.code === 0) &&
						(this.serverSyncModel.serverStatus === 'UpdateError!')
					)
					{
						//update state:
						this.update_success = false;
						//call reactors:
						this.reactors.UpdateUIerror()
					}
				});
			},
			
		},
		
		reactors:{
			
			UpdateUIsuccess()
			{	
				if(this.update_success)
				{
					//clear all forms:
					//$('form').
					//clear first:
					$('#GenUpdateSuccess').text("");
					$('#GenUpdateError').text("");
					//Update Success Message:
					$('#GenUpdateSuccess').text("Successfully Updated!");
				}
				
			},
			
			UpdateUIerror()
			{	
				if(!this.update_success)
				{
					//clear first:
					$('#GenUpdateSuccess').text("");
					$('#GenUpdateError').text("");
					//Update Error Message:
					$('#GenUpdateError').text("Error in Update! Try Again");
				}
				
			},
			
		},
	}
	
	
	