import React,{useEffect,useState} from 'react';
 import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,FlatList,ScrollView} from 'react-native'
 import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup'
import Voice from '@react-native-community/voice';
import database from '@react-native-firebase/database';
const Home=(props)=>{

  const [translatedText,setTranslatedText]=useState('-')//Çevrilen Metinin Atıldığı Değişken
  const [Flang,setFlang]=useState('en')//Metin Dili
  const [Llang,setLlang]=useState('tr')//Çevrildiği Dil
  const [mic,setMic]=useState(0)//Mikrofon açık mı kapalı mı
  const [data,setData]=useState([])//Databaseden gelen verileri atmak için 
  const [pitch, setPitch] = useState('');//Ses Düzeyi Değişkeni
  const [error, setError] = useState('');//Error Değişkeni
  const [end, setEnd] = useState('');//Bitme Değişkeni
  const [started, setStarted] = useState('');//Başlama Değişkeni
  const [results, setResults] = useState([]);//Sonuç Değişkeni
  const [partialResults, setPartialResults] = useState([]);//Sonuç Değişkeni


    
    {/*Hangi Dilin Çevrildiğini Anlamak İçin Diller Bir Değişkene Atıldı */}
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
  
    {/* Metin Girildiğinde Libretranslate API kullanılarak çeviri gerçekleştirme*/}
    const libreTranslate=async (values) => {
       translatedWords(values)
    const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q:values.MetinGir,
                source: Flang,
                target: Llang,
            }),
            headers: { "Content-Type": "application/json" }
        });
      const x=await res.json()
      setTranslatedText(x.translatedText)
    }

    {/*Aranan Kelimeleri Database'e atma */}
   const translatedWords= (values)=>{
  database()
  .ref('/data2'+"/"+values.MetinGir)
  .set({
  word:values.MetinGir,
  
})
    }

    {/* Konuşma Bitince Libretranslate API kullanılarak Anlanan Metin Çevrilir */}
     const onSpeechPartialResults = async (e) => {
      setPartialResults(e.value)
   
      // console.log('onSpeechPartialResults: ', e.value);
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        body: JSON.stringify({
            q:e.value,
            source: Flang,
            target: Llang,
           
           
        }),
        headers: { "Content-Type": "application/json" }

        
    });
    
  
   
    const x=await res.json()
 
    setTranslatedText(x.translatedText)
    };


    {/* Konuşmaya Başlandığında Çağrılır*/}
    const onSpeechStart = (e) => {
    
     
    };

   {/* Konuşma Bitince Çağrılır*/}
    const onSpeechEnd = (e) => {
setMic(0)
    };

   {/* Herhangi Bir Hata Oluşursa Çağrılır*/}
    const onSpeechError = (e) => {
    
      setError(JSON.stringify(e.error));
     
    };


   {/* SpeechRecognizer tanımayı bitirdiğinde çağrılan sonuç*/}
    const onSpeechResults = (e) => {
      
      setResults(e.value);
      if(e.value[0]=="")
      {
        setMic(0)
      }
        database()
        .ref('/data2'+"/"+e.value[0])
      .set({
        word:e.value[0],
        
      });
    
   };
   
  
   {/* Mikrofondan gelen sesin düzeyini öğrenme*/}
    const onSpeechVolumeChanged = (e) => {
     
      setPitch(e.value);
     
   
    };


 {/* Dinlemeye Başlama */}
    const startRecognizing = async () => {
      
     
      try {
        await Voice.start(Flang);
        setPitch('');
        setError('');
        setStarted('');
        setResults([]);
        setPartialResults([]);
        setEnd('');
        
      } catch (e) {
        console.error(e);
      }
      
    };
   
    
 {/*Flatlist Render Item (Databaseden gelen verileri gösterme)*/}
 const renderItem=({item})=>{
   
return(
<View  style={style.FlatlistRenderItemStyle}>
<Text style={{color:'white',textTransform:'capitalize',fontSize:15,fontFamily:'Geomanist-Book'}}>{item.key}</Text>
</View  >
)

    
 
   
}


useEffect(()=>{
 {/*Databasedeki Veriyi Çekme */}
  database()
  .ref('/data2')
  .on('value', snapshot => {
      let newArray=[]
      snapshot.forEach((item)=>{
          let ItemObject=item.val();
          ItemObject['key']=item.key
         newArray.push(ItemObject)
        
      })
   setData(newArray)
   
  });
  
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartialResults = onSpeechPartialResults;
  Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
return () => {
    
    Voice.destroy().then(Voice.removeAllListeners);
  };


},[])



 {/* Diller ve Değiştirme Iconu-- Metin Girilecek TextInput--Çevrilen Metini Yazdırma */}
    return(
       
<ScrollView style={style.container}>

    <View style={{alignItems:'center',justifyContent:'center',width:'100%'}}>
    <Text style={{color:'#546e7a',textTransform:'capitalize',fontSize:26,fontFamily:'Spantaran'}}>Rise VMB Translator</Text>



    </View>
 {/* Diller ve Değiştirme Iconu */}
<View style={{alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',marginTop:20}}>
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

 {/* Metin Girilecek TextInput*/}
<Formik 
initialValues={{
     MetinGir:'',
  }}
onSubmit={libreTranslate}
validationSchema={
Yup.object().shape({
    MetinGir:Yup.string().required('Lütfen Metin Girin'),
      })
  }
  >

    {/* Metinin Girildiği TextInput */}
{({values,handleSubmit,errors,handleChange,isValid,isSubmitting})=>(

<View style={style.forminput}>



<View style={style.inputContainer}>
<TextInput 
value={values.MetinGir}

autoCapitalize='none'
placeholder='Metin Girin'
multiline={true}
textAlignVertical={'top'}
textAlign={'center'}
placeholderTextColor={'#616161'}

onChangeText={handleChange('MetinGir')}
style={style.inputMetinGir}


/>

        </View>


{/* Çevir Butonu */}
<TouchableOpacity
style={style.CevirButon}
 onPress={handleSubmit}

>
    <Text style={style.CevirButonText}>Çevir</Text>
</TouchableOpacity>


{/* Mikrofon simgesi ve mikrofondan gelen ses */}
<TouchableOpacity onPress={()=>{startRecognizing(),setMic(1)}} style={mic==0?style.micClose:style.micOpen}>
<Icon  name={Platform.OS === "ios" ? "ios-add" : "mic-outline"}
  color={'black'}
  size={30}
      />
        </TouchableOpacity>
       

       {/*Konuşmadan sonra söylenen metini yazdırma*/}
        <View >
          {partialResults.map((result, index) => {
            return (
              <Text
                key={`partial-result-${index}`}
                >
                {result}
              </Text>
            );
          })}

        </View>



        </View>

    
)}

  </Formik>

 {/* Çevrilen Metini Yazdırma */}
  <View style={{marginBottom:25,alignSelf:'center',backgroundColor:'#cfd8dc',width:300,height:150,alignItems:'center',justifyContent:'center',borderRadius:15}}>

  <Text style={{color:'gray',textTransform:'capitalize',fontSize:12,fontFamily:'KdamThmorPro-Regular'}}>{translatedText}</Text>

  </View>

   {/* FlatList , daha önce çevrilmiş kelimeleri yazdırma */}
  <View style={style.FlatlistStyle}>
       <FlatList 
       data={data}
       renderItem={renderItem}
       numColumns={2}/>


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
inputMetinGir:{
    width:300,
    height:150, 
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
CevirButon:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#1c313a',
    borderRadius:5,
  
    marginTop:35,
    height:43,
    marginBottom:20,
},

CevirButonText:{
color:'white'
,fontSize:15,
marginHorizontal:15,
fontWeight:'700'},
imageButton:{
  width:40,height:40
},
FlatlistStyle:{
  paddingHorizontal:10,
  marginTop:15
  
      },
      FlatlistRenderItemStyle:{
        flex:1,
        marginBottom:15,
        marginHorizontal:10,
        paddingVertical:5,
        justifyContent:'center',
        alignItems:'center',
        
        borderRadius:15,
        backgroundColor:'#4ebaaa'
        },
        micClose:{
          marginBottom:10,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:'#b3e5fc',
          borderRadius:50,
          width:80,
          height:80
        },
        micOpen:{
          marginBottom:10,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:'gray',
          borderRadius:50,
          width:80,
          height:80
        }

})
export default Home