import React,{useEffect,useState} from 'react';
 import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,FlatList,ScrollView} from 'react-native'
 import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup'


const Home=(props)=>{
    
    const changeLang=()=>{

        if(Flang=='en'){
            setFlang('tr')
            setLlang('en')
        }
        else {
            setFlang('en')
            setLlang('tr')  
        }
    }

    const libreTranslate=async (values) => {
        console.log(values)

        const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q:values.Description,
                source: Flang,
                target: Llang,
                format: "text",
               
            }),
            headers: { "Content-Type": "application/json" }
        });
        const x=await res.json()
        setTranslatedText(x.translatedText)
    
    }
   

   
 
 
    const [translatedText,setTranslatedText]=useState()
    const [Flang,setFlang]=useState('en')
    const [Llang,setLlang]=useState('tr')
   




    return(
       
<ScrollView style={style.container}>
  
    
{
// Diller ve Değiştirme Iconu
}
<View style={{alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',marginTop:80}}>
<View style={{backgroundColor:'#e0e0e0',width:50,height:50,alignItems:'center',justifyContent:'center',borderRadius:15}}>
<Text style={{color:'#8d8d8d',textTransform:'capitalize',fontSize:15,fontFamily:'Geomanist-Black'}}>{Flang}</Text>

</View>

    
    <TouchableOpacity onPress={changeLang} style={{margin:10,width:50,height:50,alignItems:'center',justifyContent:'center'}}>
    <Icon  name={Platform.OS === "ios" ? "ios-add" : "swap-horizontal-outline"}
  color={'black'}
  size={20}
      />
    </TouchableOpacity>
     
    <View style={{backgroundColor:'#e0e0e0',width:50,height:50,alignItems:'center',justifyContent:'center',borderRadius:15}}>
<Text style={{color:'#8d8d8d',textTransform:'capitalize',fontSize:15,fontFamily:'Geomanist-Black'}}>{Llang}</Text>

</View>
</View>

<Formik initialValues={{
     
      Description:'',
     
      
  }}
  
onSubmit={libreTranslate}
  
  validationSchema={
      Yup.object().shape({
    

     Description:Yup.string().required('Lütfen Metin Girin'),
     
    })
  }
  >
{({values,handleSubmit,errors,handleChange,isValid,isSubmitting})=>(

    <View style={style.forminput}>







     {/* DESCRIPTION */}
        <View style={style.inputContainer}>
<TextInput 
value={values.Description}
autoCapitalize='none'
placeholder='Metin Girin'
multiline={true}
placeholderTextColor={'#616161'}
onChangeText={handleChange('Description')}
style={style.inputDescription}
/>

{(errors.Description)&&<Text style={{color:'#e57373',fontSize:18,fontFamily:'sans-serif-condensed'}}>{errors.Description}</Text>}
        </View>




      



 
{/* ADD PRODUCT BUTTON */}
<TouchableOpacity
style={style.AddProductButton}
 onPress={handleSubmit}

>
    <Text style={style.AddProductButtonText}>Çevir</Text>
</TouchableOpacity>


      
</View>
    
)}

  </Formik>
  <View style={{alignSelf:'center',backgroundColor:'#cfd8dc',width:300,height:150,alignItems:'center',justifyContent:'center',borderRadius:15}}>

   <Text style={{alignSelf:'center',fontSize:15,color:'black'}}>{translatedText}</Text>
  </View>
 
</ScrollView>

    )
}
const style=StyleSheet.create({
    container:{
    
        flex:1
    },
  


  




input:{
    width:300,
    height:50, 
    borderRadius:15,
    backgroundColor:'blue'
    ,borderColor:'black',
    borderWidth:2
},
inputDescription:{
    width:300,
    height:100, 
    borderRadius:15,
    alignSelf:'flex-start',
    backgroundColor:'#cfd8dc'
    ,borderColor:'black',
    
},
forminput:
{
alignItems:'center',
justifyContent:'center',
marginTop:25,
backgroundColor:'transparent'
},

inputContainer:{
    alignItems:'center',
    justifyContent:'center',
   
},
AddProductButton:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'black',
    borderRadius:5,
  
    marginTop:45,
    height:43,
    marginBottom:100,
},

AddProductButtonText:{
color:'white'
,fontSize:15,
marginHorizontal:15,
fontWeight:'700'},
imageButton:{
  width:40,height:40
}

})
export default Home