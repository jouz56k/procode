"""
    Script includes functions for tokenization
    of texts. It is require to filter stop words
    and convert other words to their roots, which
    reduces the total number of different words (tokens)

    NLTK package used for tokenization
    SKLEARN package contains CNB algorithm

    to use required features of NLTK it is needed
    to run nltk.download('popular') in shell
"""
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string


def get_tokens(text, lng):

    if text == '':
        return ''

    if lng not in ['en', 'fr', 'it', 'ge']:
        return ''

    # for a provided text returns its tokens
    # also removes stop words

    # because full language name needed to get stopwords below
    lang_dict = {
        'en': 'english',
        'fr': 'french',
        'it': 'italian',
        'ge': 'german'
    }

    # words/characters that will be removed from text
    stop_words = list( set(stopwords.words(lang_dict[lng])) )
    punctuations = list( string.punctuation )
    unwanted = stop_words + punctuations

    # sometimes '-' is between two words in text
    text = text.replace('-', ' ')
    text = text.lower()

    # tokenization -> list of tokens 
    tokens = word_tokenize(text)
    
    # filter unwanted tokens
    tokens = [tk for tk in tokens if tk not in unwanted]

    # to get root for tokens in text
    ps = PorterStemmer()
    tokens = [ps.stem(tk) for tk in tokens]

    # returned value is not a list but string
    # we save as such in Data model
    text_refined = ' '.join(tokens)
    return text_refined
