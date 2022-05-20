import React from 'react'
import WhatsAppWidget from 'react-whatsapp-chat-widget';
import 'react-whatsapp-chat-widget/index.css';
import useStyles from '../utils/styles';

const WhatsappChat = () => {
  const classes = useStyles();
    return (
      <div className={classes.whatsappWidget}>
        <WhatsAppWidget
          phoneNo='2349052367228'
          position='right'
          widgetWidth='300px'
          widgetWidthMobile='260px'
          autoOpen={true}
          autoOpenTimer={30000}
          messageBox={true}
          messageBoxTxt="Hi, I'd like to make an inquiry."
          iconSize='40'
          iconColor='white'
          iconBgColor='red'
          headerIcon='https://ahia.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fahia_black_logo.bfa7d64f.png&w=256&q=75'
          headerIconColor='pink'
          headerTxtColor='white'
          headerBgColor='red'
          headerTitle='Ahia Support'
          headerCaption='Online'
          bodyBgColor='#bbb'
          chatPersonName='Ahia Support'
          chatMessage={
            <>
              Hi there 👋 <br />
              <br /> How can I help you?
            </>
          }
          footerBgColor='#999'
          btnBgColor='red'
          btnTxtColor='white'
          btnTxt='Start Chat'
        />
      </div>
    );
}

export default WhatsappChat