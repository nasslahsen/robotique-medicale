# Planche contact des captures (figures ou étapes) : python3 tests/navigateur/planche.py <dossier> <prefixe>
# Produit <prefixe>0.png, <prefixe>1.png... avec six captures par planche, le nom de chaque fichier en rouge.
from PIL import Image, ImageDraw
import glob,os,re,sys
src=sys.argv[1]; pre=sys.argv[2]
fs=sorted(f for f in glob.glob(src+'/*.png') if re.search(r'-\d+\.png$',f))
W=600; per=6
for s in range(0,len(fs),per):
    ims=[]
    for f in fs[s:s+per]:
        im=Image.open(f); r=W/im.width; im=im.resize((W,int(im.height*r))); ims.append((os.path.basename(f),im))
    cols=3; rows=(len(ims)+cols-1)//cols
    hs=[max(im.height for _,im in ims[r*cols:(r+1)*cols])+30 for r in range(rows)]
    sheet=Image.new('RGB',(W*cols+20*cols,sum(hs)),'white'); d=ImageDraw.Draw(sheet); y=0
    for r in range(rows):
        for c,(n,im) in enumerate(ims[r*cols:(r+1)*cols]):
            x=c*(W+20); d.text((x+5,y+5),n,fill='red'); sheet.paste(im,(x,y+25))
        y+=hs[r]
    sheet.save(f'{pre}{s//per}.png'); print(f'{pre}{s//per}.png',[n for n,_ in ims])
