<template>
    <div class="mm_form-multiple">
        <ul>
            <li
                v-for="index in max"
                :key="index"
            >
                <div
                    :ref="setImageDivElements"
                    class="mm_form-image"
                >
                    <div class="mm_form-image-preview" />
                    <label>
                        <input
                            :ref="setImageInputElements"
                            type="file"
                            :accept="accept"
                            @change="selectImage"
                        >
                        <b class="mm_form-image-box"><i class="ico_upload" /><span class="mm_ir-blind">사진 첨부하기</span></b>
                    </label>
                    <button
                        type="button"
                        class="btn_remove-file"
                        @click="removeImage(index - 1)"
                    >
                        <i class="ico_image-remove" /><b class="mm_ir-blind">파일삭제</b>
                    </button>
                </div>
            </li>
        </ul>
        <label class="btn_select-multiple">
            <input
                type="file"
                :accept="accept"
                multiple
                @input="selectMultiple($event)"
            >
            <i class="ico_image-multiple" />
            <b>여러장 선택하기</b>
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, onMounted, PropType, ref, toRefs, watch, watchEffect } from 'vue'
import loadImage from '$/imageLoad'
import { typeCastNumber } from '$/filters';
import { defaultCatch } from '$/functions';
import { loadedImage } from '$/@type/front';

export default defineComponent({
    inheritAttrs: false,
    props: {
        // image 파일 (부모창과 양방향소통)
        modelValue: {
            type: Array,
            default: [],
        },
        // 최대 등록 가능한 image 수
        max: {
            type: Number,
            default: 3,
        },
        // default 미리보기 이미지 urls
        imageUrls: {
            type: Array as PropType<string[]>,
            default: [],
        },
        accept: {
            type: String,
            defualt: "image/*"
        }
    },
    setup(props, { emit }) {
        
        const { modelValue, max, accept, imageUrls } = toRefs(props);
        
        //이미지 input element 리스트
        const imageInputElements = ref<HTMLInputElement[]>([]);
        const setImageInputElements = (el: HTMLInputElement) => {
            imageInputElements.value.push(el);
            return imageInputElements;
        }
        //이미지 div element 리스트
        const imageDivElements = ref<HTMLDivElement[]>([]);
        const setImageDivElements = (el: HTMLInputElement) => {
            imageDivElements.value.push(el);
            return imageDivElements;
        }
        // 돔 refs 초기화
        onBeforeUpdate(() => {
            imageInputElements.value = [];
            imageDivElements.value = [];
        });

        // 로드된 이미지 객체 리스트
        const loadedImages = ref<(loadedImage|null)[]>([]);

        // default 미리보기 이미지 load 처리
        onMounted(() => {
            loadDefaultImages()
        });
        
        const loadDefaultImages = () => {
            watchEffect(() => {
                imageUrls.value.forEach((url, index) => {
                    try {
                        image.load(index, url);
                    } catch (e) {
                        // console.log(e)
                    }
                })
            })
        }

        // 복수 이미지 선택
        function selectMultiple(e: Event) {
            try {
                const multipleInput = e.target as HTMLInputElement;
                if (multipleInput.files == null) {
                    return;
                }

                // 이미지 리스트 중 비어있는 index
                const emptyIndexList = []
                for (let i = 0; i < max.value; i++) {
                    if (!modelValue.value.hasOwnProperty(i) || modelValue.value[i] === null) {
                        emptyIndexList.push(i);
                    }
                }

                if (emptyIndexList.length < 1) {
                    throw new Error(`이미지는 최대 ${max.value}개 까지 등록 가능합니다.`)
                }
                
                image.check(multipleInput);
                for (let i = 0; i < multipleInput.files?.length; i++) {
                    const targetIndex = emptyIndexList.shift();
                    if (targetIndex === undefined) {
                        throw new Error(`이미지는 최대 ${max.value}개 까지 등록 가능합니다.`)
                    }
                    image.load(targetIndex, multipleInput.files[i]);
                }
            } catch(e) {
                defaultCatch(e)
            }
        }
        
        // 이미지 선택
        function selectImage() {
            imageInputElements.value.forEach((imageInput, index) => {
                if (imageInput.files == null || typeCastNumber(imageInput?.files?.length, 0) < 1) {
                    return;
                }

                try {
                    image.check(imageInput);
                    image.load(index, imageInput.files[0]);
                } catch (e) {
                    defaultCatch(e);
                }
            })
        }
        
        // 이미지 제거
        function removeImage(imageInputIndex: number) {
            image.clear(imageInputElements.value[imageInputIndex], imageInputIndex);
        }

        const image = {
            onClass: 'S=image-on',
            load: async function (imageInputIndex: number, target: File|string) {
                const imageFileName = (target instanceof File) ? target.name : target;
                try {
                    loadImage(target, (image) => {
                        const canvas = image as HTMLCanvasElement;  // 옵션에 canvas true
                        const imageType = ((imageName: string) => {
                            const extension = imageName.split("?")[0].split(".").pop();
                            switch (extension) {
                            case 'jpg':
                            case 'jpeg':
                                return 'image/jpeg';
                            case 'png':
                                return 'image/png';
                            case 'gif':
                                return 'image/gif';
                            case 'svg':
                                return 'image/svg+xmll';
                            default:
                                return 'image/jpeg';
                            }
                        })(imageFileName)
                        canvas.width
                        const data: loadedImage = {
                            name: imageFileName,
                            type: imageType,
                            result: canvas.toDataURL(imageType, 0.95),
                            width: canvas.width,
                            height: canvas.height,
                            canvasElement: canvas,
                            file: null
                        }

                        data.file = (target instanceof File) ? target : this.baseURItoBlob(data.result);
                        loadedImages.value[imageInputIndex] = data;
                        
                        this.preview(imageInputIndex);
                        this.sync();
                    }, {
                        canvas: true,
                        orientation: true,
                        crossOrigin: 'Anonymous',// ? :boolean - 외부 경로
                        imageSmoothingQuality: 'high',
                    });
                } catch (e) {
                    // console.log(e)
                }
            },
            check: function (imageInput: HTMLInputElement) {
                if (!imageInput.files || imageInput.files.length < 1) {
                    return;
                }

                const fileList = imageInput.files;
                const accepts = imageInput.getAttribute('accept') || '';

                // 확장자 제한 없을시 이미지여부만 확인
                if (accepts === 'image/*') {
                    for (let i = 0; i < fileList.length; i++) {
                        if (!fileList[i] || fileList[i]['type'].split('/')[0] !== 'image') {
                            throw new TypeError(`이미지 파일만 등록할 수 있습니다.`);
                        }
                    }
                    return;
                }
                
                // 확장자 제한 있는경우
                for (let i = 0; i < imageInput.files.length; i++) {
                    const match = accepts.split(',').some((__accept) => {
                        return fileList[i].name.toLowerCase().endsWith(__accept.trim());
                    });

                    if (!match) {
                        throw new TypeError(`${accepts} 확장자의 파일만 등록할 수 있습니다.`);
                    }
                }
            },
            preview: function (imageInputIndex: number) {
                try {
                    const imageDiv:HTMLElement|null = imageDivElements.value[imageInputIndex] || null; // 이미지 영역 (input, preview 포함)
                    const previewDiv:HTMLElement|null = imageDiv?.querySelector('.mm_form-image-preview'); // 프리뷰 영역

                    if (imageDiv == null || previewDiv == null) {
                        throw new Error('프리뷰 영역이 존재하지 않습니다.');
                    } 
                    imageDiv.classList.add(this.onClass);

                    // 캔버스
                    const canvas = loadedImages.value[imageInputIndex]?.canvasElement || null;   // 실제 노출될 canvas
                    const context = canvas?.getContext('2d');
                    const viewCanvas = document.createElement('canvas');                // 이미지 위치, 크기 세팅용 canvas
                    const viewContext = viewCanvas.getContext('2d');

                    if (canvas == null || context == null || viewContext == null) {
                        throw new Error('이미지 프리뷰 로딩에 실패하였습니다.')
                    }

                    //세팅용 canvas 그리기
                    viewCanvas.width = canvas.width;
                    viewCanvas.height = canvas.height;
                    viewContext.drawImage(canvas, 0, 0);
                    
                    // 비율
                    const canvasRatio = canvas.width / canvas.height;
                    const previewRatio = previewDiv.offsetWidth / previewDiv.offsetHeight;

                    // 크기 계산
                    if (canvasRatio > previewRatio) {
                        // 이미지가 프리뷰 영역보다 세로로 길 때
                        viewCanvas.width = viewCanvas.height * previewRatio;// 세로 100%
                    } else {
                        // 이미지가 프리뷰 영역보다 세로로 길 때
                        viewCanvas.height = viewCanvas.width / previewRatio;// 가로 100%
                    }

                    // x,y 좌표 계산
                    const x = (viewCanvas.width - canvas.width) / 2;
                    const y = (viewCanvas.height - canvas.height) / 2;

                    viewContext.drawImage(canvas, x, y); // 좌표 적용하여 canvas에 이미지 다시 그리기

                    // 실제 노출될 canvas에 프리뷰 영역 크기 적용
                    canvas.width = previewDiv.offsetWidth;
                    canvas.height = previewDiv.offsetHeight;

                    // x,y 좌표 세팅한 canvas > 노출용 canvas에 그리기
                    context.drawImage(viewCanvas, 0, 0, canvas.width, canvas.height);

                    // 프리뷰 영역에 적용
                    previewDiv.innerHTML = '';
                    previewDiv.append(canvas);
                } catch (e) {
                    throw e;
                }
            },
            // 부모 component와 데이터 싱크
            sync: function () {
                const images: (File|Blob|null)[] = [];
                loadedImages.value.forEach(function (loadedImage, index) {
                    images[index] = loadedImage?.file || null
                });
                Object.assign(modelValue.value, images);
                emit('update:modelValue', modelValue.value);
            },
            clear: function (imageInput: HTMLInputElement, imageInputIndex: number) {
                imageInput.value = imageInput.defaultValue;
                
                const imageDiv: HTMLDivElement|null = imageDivElements.value[imageInputIndex] || null;
                imageDiv?.classList.remove(this.onClass);

                if (loadedImages.value.length > imageInputIndex) {
                    loadedImages.value[imageInputIndex] = null;
                }

                this.sync();
            },
            baseURItoBlob: function (dataURI: string) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                let byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(dataURI.split(',')[1]);
                } else {
                    byteString = unescape(dataURI.split(',')[1]);
                }
                // separate out the mime component
                const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                const byteArray = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }

                return new Blob([byteArray], {type:mimeString});
            },
        };
        
        return {
            max,
            accept,
            setImageInputElements,
            setImageDivElements,
            selectImage,
            selectMultiple,
            removeImage,
        }
    },
})
</script>