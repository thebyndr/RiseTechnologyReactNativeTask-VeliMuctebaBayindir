import React,{useEffect,useState} from 'react';
 import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,FlatList,ScrollView} from 'react-native'
 import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup'
import Voice from '@react-native-community/voice';

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
                q:speech==0?values.Description:translatedText2,
                source: Flang,
                target: Llang,
                format: "text",
               
            }),
            headers: { "Content-Type": "application/json" }
        });
        const x=await res.json()
        setTranslatedText(x.translatedText)
    
    }
    const onSpeechStart = (e) => {
      //Invoked when .start() is called without error
      console.log('onSpeechStart: ', e);
      setStarted('√');
    };
   
    const onSpeechEnd = (e) => {
      //Invoked when SpeechRecognizer stops recognition
      console.log('onSpeechEnd: ', e);
      setEnd('√');
      setTranslatedText2(partialResults)
      libreTranslate()
      
    };
   
    const onSpeechError = (e) => {
      //Invoked when an error occurs.
      console.log('onSpeechError: ', e);
      setError(JSON.stringify(e.error));
    };
   
    const onSpeechResults = (e) => {
      //Invoked when SpeechRecognizer is finished recognizing
      console.log('onSpeechResults: ', e);
      setResults(e.value);
    };
   
    const onSpeechPartialResults = (e) => {
      //Invoked when any results are computed
      console.log('onSpeechPartialResults: ', e);
      setPartialResults(e.value);
      setTranslatedText2(partialResults)
      libreTranslate()
    };
   
    const onSpeechVolumeChanged = (e) => {
      //Invoked when pitch that is recognized changed
      console.log('onSpeechVolumeChanged: ', e);
      setPitch(e.value);
    };


    const startRecognizing = async () => {
      //Starts listening for speech for a specific locale
      setSpeech(1)
      try {
        await Voice.start('en-US');
        setPitch('');
        setError('');
        setStarted('');
        setResults([]);
        setPartialResults([]);
        setEnd('');
        setSpeech(1)
      } catch (e) {
        //eslint-disable-next-line
        console.error(e);
      }
    };
   
 
 
    const [translatedText,setTranslatedText]=useState()
    const [translatedText2,setTranslatedText2]=useState()
    const [Flang,setFlang]=useState('en')
    const [Llang,setLlang]=useState('tr')
    const [speech,setSpeech]=useState(0)

    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);

 

useEffect(()=>{
    
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartialResults = onSpeechPartialResults;
  Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

  return () => {
    //destroy the process after switching the screen
    Voice.destroy().then(Voice.removeAllListeners);
  };


},[])




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
onFocus={()=>{setSpeech(0),console.log(speech)}}
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

<TouchableOpacity onPress={startRecognizing}>
          <Image
            style={style.imageButton}
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png',
            }}
          />
        </TouchableOpacity>
       
        <View >
          {partialResults.map((result, index) => {
            return (
              <Text
                key={`partial-result-${index}`}
                style={style.textStyle}>
                {result}
              </Text>
            );
          })}
        </View>
      
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