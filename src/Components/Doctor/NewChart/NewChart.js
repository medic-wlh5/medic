import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'


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
    bloodTestValues:[]
   }
 }



 handleTestTypeChange=(e)=>{
   this.setState({testtype: e.target.value})
 }

 handleBloodTestChange=(e)=>{
   this.setState({bloodtest: e.target.value})
 }

 handleVitalTestChange=(e)=>{
   this.setState({vitaltest: e.target.value})
 }
 deleteBloodTest=(e, i)=>{
   e.preventDefault()
   let filteredBloodTest= this.state.bloodTestTotals.filter((element, index)=> {
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

 handleAddBloodTest=(e, bloodTest, bloodValue)=>{
  e.preventDefault()
  const bloodTestsToChart={testName:bloodTest, testValue: bloodValue}
  this.state.bloodTestValues.push(bloodTestsToChart)
  console.log(bloodTestsToChart)
  this.setState({
      bloodTestTotals: [...this.state.bloodTestTotals, 1], 
      bloodValue: '', 
      bloodSubmit: true })
 }

 handleBloodSubmit=(e)=>{
   const {bloodTestValues}= this.state
   const {visitId}= this.props.doctor.visitId
   axios.post('/api/newchart/bloodwork', {bloodTestValues, visitId})
   .then((res)=>{
      console.log('it worked')
   })
   .catch(err=>{
     console.log(err)
   })
 }

  render(){
    console.log(this.state)
    const mappedBloodTestTotals= this.state.bloodTestTotals.map((total, i )=>{
      return(
       <React.Fragment>
       <select value={this.state.bloodtest} onChange={this.handleBloodTestChange}>
          <option value=''>Choose Blood Test</option>
          <option value='white blood cell count'> White blood cell count</option>
          </select>
          <input onChange={this.handleBloodTestValue}></input>
          <button onClick={(e)=>this.deleteBloodTest(e,i)}>Delete Test</button>
       </React.Fragment>
      )
    })

    const mappedVitalTestTotals= this.state.vitalTestTotals.map((total, i)=>{
      return(
        <React.Fragment key={i}>
         <select value={this.state.vitaltest} onChange={this.handleVitalTestChange}>
          <option value='resting heart rate'>Resting heart rate</option>
          </select>
          <input></input>
          <button onClick={(e)=>this.deleteVitalTest(e,i)}>Delete Test</button>
        </React.Fragment>
      )
    })
    return(
      
      <div>
        <p>New Chart</p>
        
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
          <button onClick={()=>this.setState({vitalTestTotals: [...this.state.vitalTestTotals, 1]})}>Add test</button>
          <button disabled={this.state.vitalSubmit}>Chart It Real Good</button>
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
