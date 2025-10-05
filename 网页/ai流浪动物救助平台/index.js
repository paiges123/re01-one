// //模糊查询
//定义数组，存储搜索的内容
document.addEventListener('DOMContentLoaded', function() {
 const breeds = ['金毛','边牧','柴犬','柯基','萨摩耶','蓝猫','狸花猫','布偶猫','波斯猫','吉娃娃','博美','奶牛猫','缅因猫'];
 const keyword = document.querySelector('.keyword');//获取输入框
 const searchHelper = document.querySelector('.search-helper');//获取搜索框下拉列表

 
 //给输入框绑定内容改变事件
//  keyword.oninput = function(){
//     for(let i=0; i < breeds.length; i++){
//          if(breeds[i].indexOf(keyword.value) != -1){
//              searchHelper.innerHTML += '<p>'+breeds[i]+'</p>';
//              searchHelper.style.display ='block';
//          }
//      }
//  }

keyword.oninput = function() {
  const value = this.value.trim();
  searchHelper.innerHTML = ''; //每次输入先清空列表，避免重复

  if (!value) {
    searchHelper.style.display = 'none';
    return;
  }

  // 筛选匹配项
  const matches = breeds.filter(breed => breed.includes(value));

   if (matches.length > 0) {
    matches.forEach(breed => {
      // 创建p标签并绑定点击事件
      const p = document.createElement('p');
      p.textContent = breed;
      p.style.margin = '5px 0';
      p.style.cursor = 'pointer'; // 鼠标悬停显示手型，提示可点击

      // 点击事件：将当前选项填入输入框，并隐藏下拉列表
      p.onclick = function() {
        keyword.value = breed; // 赋值到输入框
        searchHelper.style.display = 'none'; // 隐藏列表
      };

      searchHelper.appendChild(p);
    });
    searchHelper.style.display = 'block';
  } else {
    searchHelper.innerHTML = '<p>无匹配结果</p>';
    searchHelper.style.display = 'block';
  }
};

 //鼠标失焦
 keyword.onblur = function(){
    setTimeout(() => {
    searchHelper.style.display ='none';
    }, 300);
  };
});

//图片轮播
let img = document.querySelector('.img');

let imgArr =['jiuzhu1.png','jiuzhu2.png','jiuzhu3.png'];

let count = 0;

//定义函数，用来切换图片的路径
function cutImg(){
  img.src = './images/' + imgArr[count];
}

setInterval(function(){
  count++;

  if(count > imgArr.length - 1){
    count = 0;
  }
  cutImg();

},3000);

//文字轮播
// 在index.js中添加轮播逻辑
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.kepu-item');
    let currentIndex = 0;
    
    // 显示当前索引的文字
    function showCurrentItem() {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
    }
    
    // 切换到下一个文字
    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showCurrentItem();
    }
    
    // 初始显示第一个文字
    showCurrentItem();
    
    // 每3秒切换一次
    setInterval(nextItem, 3000);
});


document.addEventListener('DOMContentLoaded', function() {
    // 获取AI识别按钮
    const aiScanBtn = document.getElementById('aiScanBtn');
    
    if (!aiScanBtn) {
        console.error('未找到AI识别按钮，请检查HTML中的id是否为"aiScanBtn"');
    } else {
        aiScanBtn.addEventListener('click', startScan);
    }

    // 创建扫描模态框（包含摄像头和图片上传功能）
    function createScanModal() {
        if (document.getElementById('scanModal')) {
            return document.getElementById('scanVideo');
        }
        
        // 模态框容器
        const modal = document.createElement('div');
        modal.id = 'scanModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        // 视频/图片容器（同时支持摄像头画面和上传的图片）
        const mediaContainer = document.createElement('div');
        mediaContainer.id = 'mediaContainer';
        mediaContainer.style.cssText = `
            position: relative;
            width: 100%;
            max-width: 600px;
            height: 70vh;
            max-height: 500px;
        `;
        
        // 视频元素（摄像头用）
        const video = document.createElement('video');
        video.id = 'scanVideo';
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border: 2px solid white;
            border-radius: 8px;
            display: block;
        `;
        
        // 图片元素（上传图片用）
        const image = document.createElement('img');
        image.id = 'uploadedImage';
        image.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            border: 2px solid white;
            border-radius: 8px;
            display: none; /* 默认隐藏，上传图片后显示 */
        `;
        
        // 扫描框（仅摄像头模式显示）
        const scanFrame = document.createElement('div');
        scanFrame.id = 'scanFrame';
        scanFrame.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 50%;
            border: 2px solid #4CAF50;
            box-shadow: 0 0 0 1000px rgba(0,0,0,0.5);
            pointer-events: none;
        `;
        
        // 扫描线（仅摄像头模式显示）
        const scanLine = document.createElement('div');
        scanLine.id = 'scanLine';
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #4CAF50;
            animation: scan 2s linear infinite;
        `;
        
        // 扫描动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scan {
                0% { top: 0; }
                50% { top: calc(100% - 2px); }
                100% { top: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 按钮容器（新增上传图片按钮）
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        `;
        
        // 拍照识别按钮（摄像头模式）
        const captureBtn = document.createElement('button');
        captureBtn.textContent = '拍照识别';
        captureBtn.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        // 上传图片按钮
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = '上传图片识别';
        uploadBtn.style.cssText = `
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        // 切换摄像头/图片模式按钮
        const switchBtn = document.createElement('button');
        switchBtn.textContent = '切换到图片模式';
        switchBtn.style.cssText = `
            padding: 10px 20px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        
        // 隐藏的文件选择器（用于上传图片）
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // 只允许图片文件
        fileInput.style.display = 'none';
        fileInput.id = 'imageUploader';
        
        // 结果显示区域
        const resultArea = document.createElement('div');
        resultArea.id = 'scanResult';
        resultArea.style.cssText = `
            margin-top: 20px;
            color: white;
            font-size: 18px;
            text-align: center;
            min-height: 80px;
            width: 80%;
            max-width: 600px;
        `;
        
        // 组装元素
        mediaContainer.appendChild(video);
        mediaContainer.appendChild(image);
        mediaContainer.appendChild(scanFrame);
        mediaContainer.appendChild(scanLine);
        btnContainer.appendChild(captureBtn);
        btnContainer.appendChild(uploadBtn);
        btnContainer.appendChild(switchBtn);
        btnContainer.appendChild(closeBtn);
        modal.appendChild(mediaContainer);
        modal.appendChild(btnContainer);
        modal.appendChild(fileInput);
        modal.appendChild(resultArea);
        document.body.appendChild(modal);
        
        // 模式切换（摄像头/图片）
        let isCameraMode = true;
        switchBtn.addEventListener('click', () => {
            isCameraMode = !isCameraMode;
            if (isCameraMode) {
                // 切换到摄像头模式
                video.style.display = 'block';
                image.style.display = 'none';
                scanFrame.style.display = 'block';
                scanLine.style.display = 'block';
                captureBtn.style.display = 'block';
                switchBtn.textContent = '切换到图片模式';
                resultArea.textContent = '摄像头已启动，请点击"拍照识别"';
            } else {
                // 切换到图片模式
                video.style.display = 'none';
                image.style.display = 'block';
                scanFrame.style.display = 'none';
                scanLine.style.display = 'none';
                captureBtn.style.display = 'none';
                switchBtn.textContent = '切换到摄像头模式';
                resultArea.textContent = '请点击"上传图片识别"选择本地图片';
            }
        });
        
        // 上传图片按钮点击事件（触发文件选择器）
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // 选择图片后预览并识别
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // 预览图片
            const reader = new FileReader();
            reader.onload = (event) => {
                image.src = event.target.result;
                image.style.display = 'block';
                video.style.display = 'none';
                scanFrame.style.display = 'none';
                scanLine.style.display = 'none';
                resultArea.textContent = '图片已上传，正在识别...';
                
                // 延迟识别，让图片加载完成
                setTimeout(() => {
                    recognizeImage(image); // 调用图片识别函数
                }, 500);
            };
            reader.readAsDataURL(file);
        });
        
        // 关闭按钮事件
        closeBtn.addEventListener('click', () => {
            stopScan();
            modal.remove();
            // 重置文件选择器（避免重复选择同一张图片不触发事件）
            fileInput.value = '';
        });
        
        // 拍照识别事件
        captureBtn.addEventListener('click', () => {
            captureAndRecognize(video);
        });
        
        return video;
    }

    // 启动摄像头扫描
    function startScan() {
        const video = createScanModal();
        const resultArea = document.getElementById('scanResult');
        
        resultArea.textContent = '正在启动摄像头...请授予权限';
        
        // 获取摄像头权限
        navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
        })
        .then(stream => {
            video.srcObject = stream;
            resultArea.textContent = '摄像头已启动，请点击"拍照识别"或切换到图片模式';
        })
        .catch(err => {
            console.error('摄像头访问失败:', err);
            resultArea.textContent = '无法访问摄像头，请检查权限或设备';
        });
    }

    // 停止扫描（释放摄像头）
    function stopScan() {
        const video = document.getElementById('scanVideo');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    // 摄像头拍照识别
    function captureAndRecognize(video) {
        const resultArea = document.getElementById('scanResult');
        
        if (!video || !video.srcObject) {
            resultArea.textContent = '摄像头未启动，请检查设备';
            return;
        }
        
        // 创建画布捕获当前视频帧
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        resultArea.textContent = '正在识别...';
        // 调用通用识别函数（传入画布作为图像源）
        analyzeImage(canvas);
    }

    // 上传图片识别
    function recognizeImage(image) {
        // 创建画布绘制上传的图片
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // 调用通用识别函数
        analyzeImage(canvas);
    }

    // 替换为真实AI接口调用（百度动物识别API示例）
function analyzeImage(canvas) {
    const resultArea = document.getElementById('scanResult');
    resultArea.textContent = '正在调用AI接口识别...';

    //  将画布转为base64格式（去掉前缀，仅保留图片数据）
    const base64Image = canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');

    //  百度AI接口参数
    const accessToken = '24.982872b7c30e0b66daa0f1695a413023.2592000.1762255853.282335-120244559'; // 这里必须替换为真实token
    const apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=${accessToken}`;

    //  调用百度动物识别API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `image=${encodeURIComponent(base64Image)}` // 编码图片数据
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('接口调用失败');
        }
        return response.json();
    })
    .then(data => {
        // 4. 处理接口返回结果
        if (data.error_code) {
            // 错误处理（如token过期、权限问题）
            resultArea.textContent = `识别失败：${data.error_msg}`;
            console.error('API错误:', data);
            return;
        }

        // 5. 显示识别结果（取置信度最高的结果）
        if (data.result && data.result.length > 0) {
            const topResult = data.result[0];
            resultArea.innerHTML = `
                <strong>识别结果:</strong><br>
                动物名称: ${topResult.name}<br>
                置信度: ${(topResult.score * 100).toFixed(2)}%<br>
                类别: ${topResult.baike_info ? topResult.baike_info.description : '无详细信息'}
            `;
        } else {
            resultArea.textContent = '未识别到动物，请尝试其他图片';
        }
    })
    .catch(err => {
        console.error('识别过程出错:', err);
        resultArea.textContent = '识别失败，请检查网络或重试';
    });
}

    // 其他页面功能（如轮播图）
    const imgElement = document.querySelector('.carousel-img');
    if (imgElement) {
        const imgArr = ['jiuzhu1.png', 'jiuzhu2.png', 'jiuzhu3.png'];
        let currentIndex = 0;
        
        function updateImage() {
            imgElement.src = `./images/${imgArr[currentIndex]}`;
        }
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % imgArr.length;
            updateImage();
        }, 3000);
    }
});