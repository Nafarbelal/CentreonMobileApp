<TouchableOpacity onPress={() => navigate('HostDetail',{desc:this.state.data[key].name})}  key={key} style={{margin:5,borderRadius:10,backgroundColor:this.getColor(this.state.data[key].state),padding:10,flexDirection:"row",alignItems:'center'}}>
    <View style={{width:300}}>
        <Text style={{fontWeight:"bold",fontSize:20}}>{ this.state.data[key].name }</Text>
        <Text>{ this.getStatus(this.state.data[key].state) }</Text>
        <Text>{ this.state.data[key].output }</Text>
    </View>
    <TouchableHighlight n style={{marginLeft:50}}>
    <Icon name="arrow-forward"/>
    </TouchableHighlight>  
</TouchableOpacity >