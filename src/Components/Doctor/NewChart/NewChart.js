import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import BloodTestSelection from './BloodTestSelection';
import VitalTestSelection from './VitalTestSelection';


class  NewChart extends Component  {
 constructor(){
   super()
   this.state={
    testtype: '',
    bloodtest: '',
    vitaltest: '',
    bloodTestTotals: [1],
    vitalTestTotals: [1],
    vitalSubmit: true,
    bloodSubmit: true,
    vitalValue: '',
    bloodValue: '',
    bloodTestValues:[], 
    vitalTestValues: []
   }
 }



 handleTestTypeChange=(e)=>{
   this.setState({testtype: e.target.value})
 }




 deleteBloodTest=(e, i)=>{
   e.preventDefault()
   let filteredBloodTest= this.state.bloodTestTotals.filter((element, index)=> {
     console.log(index, i)
    return index !== i;
   })
   this.setState({bloodTestTotals: filteredBloodTest})
 }

 deleteVitalTest=(e, i)=>{
   e.preventDefault()
   let filteredVitalTest= this.state.vitalTestTotals.filter((element, index)=>{
     return index !==i
   })
   this.setState({vitalTestTotals: filteredVitalTest})
 }

 handleBloodTestValue=(e)=>{
   this.setState({
     bloodValue: e.target.value
   })
   if(this.state.bloodValue.length > 0){
    this.setState({
      bloodSubmit: false
    })
  }
 }

 handleVitalTestValue=(e)=>{
   this.setState({
     vitalValue: e.target.value
   })
   if(this.state.vitalValue.length > 0){
     this.setState({
       vitalSubmit: false
     })
   }
 }

 handleAddBloodTest=(e, bloodTest, bloodValue)=>{
  e.preventDefault()
  const bloodTestsToChart={testName:bloodTest, testValue: bloodValue}
  this.state.bloodTestValues.push(bloodTestsToChart)
 
  this.setState({
      bloodTestTotals: [...this.state.bloodTestTotals, 1], 
      bloodValue: '', 
      bloodSubmit: true })
 }

 handleAddVitalTest=(e, vitalTest, vitalValue)=>{
   e.preventDefault()
   const vitalTestsToChart={testName: vitalTest, testValue: vitalValue}
   this.state.vitalTestValues.push(vitalTestsToChart)

   this.setState({
     vitalTestTotals: [...this.state.vitalTestTotals, 1],
     vitalValue: '',
     vitalSubmit: true
   })
 }

 handleBloodSubmit=(e)=>{
   const {bloodTestValues}= this.state
   const visitId= this.props.doctor.visitId
   console.log(visitId)
   axios.post('/api/newchart/bloodwork', {bloodTestValues, visitId})
   .then((res)=>{
      console.log(res)
   })
   .catch(err=>{
     console.log(err)
   })
 }

 handleVitalSubmit=(e)=>{
   const {vitalTestValues}= this.state
   const visitId= this.props.doctor.visitId

   axios.post('/api/newchart/vitals', {vitalTestValues, visitId})
   .then((res)=>{
     console.log(res)
   })
   .catch(err=>{
     console.log(err)
   })
 }

  render(){
    console.log(this.props.doctor.visitId)
    const mappedBloodTestTotals= this.state.bloodTestTotals.map((total, i )=>{
      return(
       <BloodTestSelection handleBloodTestChange={this.handleBloodTestChange} handleBloodTestValue={this.handleBloodTestValue} deleteBloodTest={this.deleteBloodTest} i={i}/>
      )
    })

    const mappedVitalTestTotals= this.state.vitalTestTotals.map((total, i)=>{
      return(
       <VitalTestSelection handleVitalTestValue={this.handleVitalTestValue} deleteVitalTest={this.deleteVitalTest} i={i}/>
      )
    })
    return(
      
      <div>
        <p>Create New Chart</p>
        
        <form>
        <label>
        Choose test type:
        
          <select value={this.state.testtype} onChange={this.handleTestTypeChange}>
          <option value=''></option>
          <option value='bloodwork'>Blood work</option>
          <option value='vitals'>Vitals</option>
          </select>
        </label>
        </form>
        {this.state.testtype === 'bloodwork' ?
        <form>
          {mappedBloodTestTotals}
          <button onClick={(e)=>this.handleAddBloodTest(e, this.state.bloodtest, this.state.bloodValue)}>Add more tests</button>
          <button disabled={this.state.bloodSubmit} onClick={this.handleBloodSubmit}>Chart It Real Good</button>
        </form>
        :
        null
        }
        {this.state.testtype ==='vitals' ?
        <form>
          {mappedVitalTestTotals}
          <button onClick={(e)=>this.handleAddVitalTest(e, this.state.vitaltest, this.state.vitalValue)}>Add test</button>
          <button disabled={this.state.vitalSubmit} onClick={this.handleVitalSubmit}>Chart It Real Good</button>
        </form>
        :
        null

        }

        
      </div>
    )
  }
}

const mapStateToProps=(reduxState)=>{
  return reduxState
}

export default connect(mapStateToProps)(NewChart)
