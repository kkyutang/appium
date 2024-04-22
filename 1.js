const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:noReset': 'true',
  'appium:autoGrantPermissions': 'true', //Android에서 권한을 자동으로 허용
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function clickElement(driver, xpath) {
  const element = await driver.$(xpath);
  await element.click();
  console.debug('clickElement', xpath);
}

async function setValue(driver, xpath, value) {
  const element = await driver.$(xpath);
  await element.setValue(value);
  console.debug('setValue', xpath);
}

async function touchAction(driver, xpath, action) {
  const element = await driver.$(xpath);
  await element.touchAction(action);
  console.debug('touchAction', xpath);
}

async function tapElement(driver, accessibilityId) {
  const element = await driver.$(`android=new UiSelector().description("${accessibilityId}")`);
  await element.click();
  console.debug('tapElement', xpath);
}

function getErrorLineNumber(e) {
  if (!(e instanceof Error)) {
      e = new Error(e);
  }

  const lineRegex = /runTest .+?:(\d+):/;
  const match = lineRegex.exec(e.stack);

  if (match) {
      const lineNumber = match[1];
      return lineNumber;
  } else {
      return 0;
  }
}

function sendSlackMessage2(message2){
  var myHeaders = new Headers();
  myHeaders.append("Content-type", "application/json; charset=utf-8");
  myHeaders.append("Authorization", "Bearer xoxb-6737288415267-6737381495430-VbudiILwACEwwN9JOVSiggTR");
  
  var raw = `{\n  \"channel\": \"C06MP8Q4ZNX\",\n  \"text\": \"${message2}\"\n}`;
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://slack.com/api/chat.postMessage", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {
     // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 88 y : 2006

    // 탭할 영역의 좌표 설정
    const tapX = 137;
    const tapY = 2087;

    // 전체 값을 선택하여 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
   
      // 특정 좌표 탭 (Tap)
      await driver.touchAction([
        { action: 'tap', x: tapX, y: tapY },
      ]);

      // 5초 대기 
      await driver.pause(5000);

      // 롱프레스할 요소의 XPath
      const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath) },
        { action: 'moveTo', x: 534, y: 2090 },  // 스와이프 거리 및 방향 조절
        { action: 'release' },
      ]);

      await clickElement(driver, '//*[@text="전송"]');

      // 20초대기
      await driver.pause(20000);
    
      
    
     // 20초대기
     await driver.pause(20000);
   } catch (error) { }
  finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);