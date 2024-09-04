import sys
import re
from konlpy.tag import Okt

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences



# Start Log
print("Model Predict Call From Python")

# 이후에는 파일로
stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']

okt = Okt()


# 선택된 모델 이름을 호출할 파라미터
print("Fisrt argument: " + sys.argv[1])
#print("Second argument: " + sys.argv[2])

# 모델 파일 로드
loaded_model = load_model('best_model.keras');
print (sentiment_predict(sys.argv[1]));


def sentiment_predict(new_sentence):
    new_sentence = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣 ]', '', new_sentence)
    new_sentence = okt.morphs(new_sentence, stem=True)  # 토큰화
    new_sentence = [word for word in new_sentence if not word in stopwords]  # 불용어 제거
    encoded = tokenizer.texts_to_sequences([new_sentence])  # 정수 인코딩
    pad_new = pad_sequences(encoded, maxlen=max_len)  # 패딩
    score = float(loaded_model.predict(pad_new)[0][0])  # 예측 결과의 첫 번째 요소를 추출하여 변환

    print('score ::::', score);

    if score > 0.5:
        print("{:.2f}% 확률로 긍정 리뷰입니다.\n".format(score * 100))
    else:
        print("{:.2f}% 확률로 부정 리뷰입니다.\n".format((1 - score) * 100))





