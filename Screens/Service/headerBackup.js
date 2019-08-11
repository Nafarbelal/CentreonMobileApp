  <Header
              placement="left"
              leftComponent={this.props.navigation.getParam('desc', '')!==''?<Icon name="arrow-back" color={"white"} onPress={() => this.props.navigation.navigate('ByHost')} />:<Menu navigation={this.props.navigation} />}
              centerComponent={<View style={styles.view}>
              <Image
              source={require('../../assets/image/logo.png')}
              style={{ width: 26, height: 26 }}
              />
                <Text style={{marginLeft:10,fontSize:18,color:'white'}}>Service Status</Text>
                </View>
            }
              rightComponent={
                <Picker
                selectedValue="All"
                style={{height: 50, width: 130,color:"white"}}
                
                onValueChange={(itemValue, itemIndex) =>
                  {
                    if(itemIndex===1) navigate('ByHost')
                  }
                }>
                <Picker.Item label="All" value="All" />
                <Picker.Item label="By Host" value="By Host" />
              </Picker>
              
            }
            backgroundColor="#212121"
            style={{height:10}}
    />