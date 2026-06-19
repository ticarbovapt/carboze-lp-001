# -*- coding: utf-8 -*-
"""Gera o PDF do roteiro de abordagem pos-venda da CarboZe.
Uso: python scripts/gen_roteiro_posvenda_pdf.py
Saida: docs/roteiro-pos-venda-carboze.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    KeepTogether,
)

VERDE   = colors.HexColor("#093a30")
LIMAO   = colors.HexColor("#a9da00")
VERDEM  = colors.HexColor("#6fae0b")
TINT    = colors.HexColor("#eef4ec")
TINTB   = colors.HexColor("#d8e6d4")
INK     = colors.HexColor("#1b2a26")
MUTE    = colors.HexColor("#5b6b66")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "docs", "roteiro-pos-venda-carboze.pdf")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

styles = getSampleStyleSheet()
S = {}
S["title"]   = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=21, leading=24, textColor=colors.white)
S["sub"]     = ParagraphStyle("sub", fontName="Helvetica", fontSize=10.5, leading=14, textColor=LIMAO)
S["step"]    = ParagraphStyle("step", fontName="Helvetica-Bold", fontSize=12.5, leading=15, textColor=colors.white)
S["h2"]      = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=VERDE, spaceBefore=4, spaceAfter=4)
S["body"]    = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, textColor=INK)
S["ask"]     = ParagraphStyle("ask", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=VERDE)
S["consult"] = ParagraphStyle("consult", fontName="Helvetica-Oblique", fontSize=10, leading=14, textColor=INK)
S["cli"]     = ParagraphStyle("cli", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=VERDE)
S["rep"]     = ParagraphStyle("rep", fontName="Helvetica", fontSize=9.5, leading=13, textColor=INK)
S["tag"]     = ParagraphStyle("tag", fontName="Helvetica-Bold", fontSize=11, leading=12, textColor=VERDE, alignment=1)
S["small"]   = ParagraphStyle("small", fontName="Helvetica", fontSize=8.5, leading=11, textColor=MUTE)
S["note"]    = ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=8.8, leading=12, textColor=MUTE)
S["white"]   = ParagraphStyle("white", fontName="Helvetica", fontSize=9.5, leading=13, textColor=colors.white)

PAGE_W, PAGE_H = A4
LM = RM = 16 * mm
CONTENT_W = PAGE_W - LM - RM

story = []

def section_header(title):
    p = Paragraph(title, S["step"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), VERDE),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LINEBELOW", (0,0), (-1,-1), 2.2, LIMAO),
    ]))
    return t

def step_header(num, title):
    p = Paragraph(f'PASSO {num} &nbsp;&nbsp;|&nbsp;&nbsp; {title}', S["step"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), VERDE),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LINEBELOW", (0,0), (-1,-1), 2.2, LIMAO),
    ]))
    return t

def ask_block(text):
    p = Paragraph(text, S["ask"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), TINT),
        ("LINEBEFORE", (0,0), (-1,-1), 3, LIMAO),
        ("LEFTPADDING", (0,0), (-1,-1), 9),
        ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return t

def consult_line(text):
    p = Paragraph(f'<b>Consultor:</b> "{text}"', S["consult"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), TINT),
        ("LINEBEFORE", (0,0), (-1,-1), 3, VERDEM),
        ("LEFTPADDING", (0,0), (-1,-1), 9),
        ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return t

def branch(letter, cli, rep, action=None):
    inner = [Paragraph(f'<b>Cliente:</b> {cli}', S["cli"]),
             Spacer(1, 2),
             Paragraph(f'<b>Consultor:</b> {rep}', S["rep"])]
    if action:
        inner.append(Spacer(1, 2))
        inner.append(Paragraph(action, S["note"]))
    tag = Table([[Paragraph(letter, S["tag"])]], colWidths=[16], rowHeights=[16])
    tag.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIMAO),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING", (0,0), (-1,-1), 2),
        ("BOTTOMPADDING", (0,0), (-1,-1), 0),
    ]))
    t = Table([[tag, inner]], colWidths=[24, CONTENT_W-24])
    t.setStyle(TableStyle([
        ("VALIGN", (0,0), (0,0), "TOP"),
        ("VALIGN", (1,0), (1,0), "TOP"),
        ("BACKGROUND", (0,0), (-1,-1), colors.white),
        ("LINEBELOW", (0,0), (-1,-1), 0.6, TINTB),
        ("LEFTPADDING", (0,0), (0,0), 0),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING", (1,0), (1,0), 8),
    ]))
    return t

def spacer(h=8):
    return Spacer(1, h)

# ---------- CAPA / HEADER ----------
header = Table([
    [Paragraph("CARBOZÉ", ParagraphStyle("logo", fontName="Helvetica-Bold", fontSize=15, textColor=colors.white))],
    [Paragraph("ROTEIRO DE ABORDAGEM PÓS-VENDA", S["title"])],
    [Paragraph("Contato proativo com o cliente que comprou e já recebeu o produto", S["sub"])],
], colWidths=[CONTENT_W])
header.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), VERDE),
    ("LEFTPADDING", (0,0), (-1,-1), 14),
    ("RIGHTPADDING", (0,0), (-1,-1), 14),
    ("TOPPADDING", (0,0), (0,0), 12),
    ("BOTTOMPADDING", (0,0), (0,0), 2),
    ("TOPPADDING", (0,1), (0,1), 2),
    ("BOTTOMPADDING", (0,2), (0,2), 12),
    ("TOPPADDING", (0,2), (0,2), 4),
    ("LINEBELOW", (0,-1), (-1,-1), 3, LIMAO),
]))
story.append(header)
story.append(spacer(10))

# ---------- COMO USAR ----------
story.append(Paragraph("Como usar este roteiro", S["h2"]))
como = ("O consultor <b>inicia</b> o contato (WhatsApp ou ligação). A cada pergunta, identifique a resposta do "
        "cliente (<b>A</b>, <b>B</b> ou <b>C</b>) e siga a fala indicada. Personalize sempre com o nome do cliente, "
        "com tom humano e sem pressa. Ao final, registre tudo na pesquisa: <b>carboze.com.br/nps</b>.")
story.append(Paragraph(como, S["body"]))
story.append(spacer(6))

dos = Table([[
    Paragraph("<b>FAÇA</b><br/>• Aborde só quem já recebeu<br/>• Horário comercial<br/>• Ouça mais do que fala<br/>• Registre cada conversa", S["body"]),
    Paragraph("<b>EVITE</b><br/>• Enviar link sem contexto<br/>• Insistir após recusa<br/>• Prometer o que não pode cumprir<br/>• Soar como robô / script decorado", S["body"]),
]], colWidths=[CONTENT_W/2, CONTENT_W/2])
dos.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,0), TINT),
    ("BACKGROUND", (1,0), (1,0), colors.HexColor("#fbeceA")),
    ("LINEBEFORE", (0,0), (0,0), 3, VERDEM),
    ("LINEBEFORE", (1,0), (1,0), 3, colors.HexColor("#d98b8b")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("LEFTPADDING", (0,0), (-1,-1), 9),
    ("RIGHTPADDING", (0,0), (-1,-1), 9),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
]))
story.append(dos)
story.append(spacer(12))

# ---------- PASSO 1 ----------
story.append(KeepTogether([
    step_header(1, "ABERTURA"),
    spacer(5),
    consult_line('Olá, {nome}! Aqui é o [seu nome], do time de pós-venda da CarboZé. Tudo bem? '
                 'Vi que seu pedido já foi entregue e queria saber se chegou tudo certinho.'),
    spacer(3),
    Paragraph("Aguarde a resposta e siga para o Passo 2.", S["note"]),
]))
story.append(spacer(12))

# ---------- PASSO 2 ----------
story.append(KeepTogether([
    step_header(2, "A ENTREGA"),
    spacer(5),
    ask_block('Pergunte: "Seu pedido chegou em boas condições?"'),
    spacer(5),
    branch("A", '"Sim, chegou certinho."',
           '"Que bom! Fico feliz que deu tudo certo."',
           "Ação: vá para o Passo 3."),
    branch("B", '"Chegou, mas teve um problema (atraso, avaria ou faltou item)."',
           '"Sinto muito por isso, {nome}. Me conta o que aconteceu que eu já resolvo pra você."',
           "Ação: registre, abra a ocorrência e resolva. Depois retome o Passo 3."),
    branch("C", '"Ainda não chegou."',
           '"Vou verificar o rastreio agora mesmo e te dou um retorno."',
           "Ação: trate como logística e pause o pós-venda até a entrega."),
]))
story.append(spacer(12))

# ---------- PASSO 3 ----------
story.append(KeepTogether([
    step_header(3, "O USO DO PRODUTO"),
    spacer(5),
    ask_block('Pergunte: "Você já teve a chance de usar o CarboZé no seu veículo?"'),
    spacer(5),
    branch("A", '"Sim, já usei."',
           '"Ótimo!"',
           "Ação: vá para o Passo 4."),
    branch("B", '"Ainda não usei."',
           '"Tranquilo! É só adicionar no tanque antes de abastecer — um sachê por tanque (moto) ou a medida '
           'indicada (carro). Posso te mandar um vídeo rápido de como usar?"',
           "Ação: envie o material, agende retorno em ~7 dias e vá para o Passo 6."),
]))
story.append(spacer(12))

# ---------- PASSO 4 ----------
story.append(KeepTogether([
    step_header(4, "O RESULTADO"),
    spacer(5),
    ask_block('Pergunte: "E como foi? Notou alguma diferença no veículo?"'),
    spacer(5),
    branch("A", '"Senti melhora (partida, rendimento ou motor mais suave)."',
           '"Que ótimo ouvir isso! É exatamente pra isso que ele foi feito."',
           "Ação: vá para o Passo 5 (provável promotor)."),
    branch("B", '"Ainda não notei diferença."',
           '"Entendo. O CarboZé age a cada abastecimento, então o efeito aparece com o uso contínuo. '
           'Recomendo usar em todo abastecimento por algumas semanas. Posso te acompanhar e ver como fica?"',
           "Ação: oriente, agende follow-up e vá para o Passo 5."),
    branch("C", '"Tive um problema / não gostei."',
           '"Poxa, sinto muito. Me explica o que aconteceu pra eu te ajudar?"',
           "Ação: escute, registre, ofereça orientação técnica ou solução e vá para o Passo 5."),
]))
story.append(spacer(12))

# ---------- PASSO 5 ----------
story.append(KeepTogether([
    step_header(5, "A RECOMENDAÇÃO (NPS)"),
    spacer(5),
    ask_block('Pergunte: "De 0 a 10, o quanto você recomendaria o CarboZé pra um amigo?"'),
    spacer(5),
    branch("A", 'Nota 9 a 10 — PROMOTOR',
           '"Muito obrigado! Já que você curtiu, posso te pedir uma força? Uma avaliação sua na loja onde comprou '
           '(Mercado Livre ou Amazon) ajuda muito outros motoristas. Te mando o link?"',
           "Ação: envie o link de avaliação e ofereça indicação a amigos."),
    branch("B", 'Nota 7 a 8 — NEUTRO',
           '"Bacana! E o que faltou pra ser um 10? Sua resposta ajuda a gente a melhorar."',
           "Ação: ouça com atenção e registre o ponto de melhoria."),
    branch("C", 'Nota 0 a 6 — DETRATOR',
           '"Obrigado pela sinceridade. O que mais te incomodou? Quero resolver isso com você."',
           "Ação: acolha, registre e encaminhe a solução com um prazo claro."),
]))
story.append(spacer(12))

# ---------- PASSO 6 ----------
story.append(KeepTogether([
    step_header(6, "REGISTRO (PESQUISA)"),
    spacer(5),
    consult_line("Pra deixar tudo registrado e ajudar nosso time, posso te enviar uma pesquisa rapidinha de 1 minuto?"),
    spacer(5),
    branch("A", '"Pode."',
           '"Perfeito! É só clicar aqui: carboze.com.br/nps. Obrigado!"'),
    branch("B", '"Agora não dá."',
           '"Sem problema! Deixo o link aqui e você responde quando puder: carboze.com.br/nps"'),
]))
story.append(spacer(12))

# ---------- PASSO 7 ----------
story.append(KeepTogether([
    step_header(7, "ENCERRAMENTO"),
    spacer(5),
    consult_line("Obrigado pelo seu tempo, {nome}! Qualquer dúvida sobre o produto — ou quando quiser repor — "
                 "é só me chamar por aqui. Boa estrada!"),
    spacer(4),
    Paragraph("• <b>Promotor:</b> reforce o convite para avaliar e indicar.  "
              "• <b>Insatisfeito:</b> confirme a solução encaminhada e o prazo de retorno.", S["body"]),
]))
story.append(spacer(14))

# ---------- OBJEÇÕES ----------
story.append(section_header("RESPOSTAS A OBJEÇÕES COMUNS"))
story.append(spacer(6))
obj_rows = [
    [Paragraph("<b>O cliente diz</b>", S["white"]), Paragraph("<b>O consultor responde</b>", S["white"])],
    [Paragraph('"Não tenho tempo agora."', S["rep"]), Paragraph('"Sem problema! Falo rapidinho ou te chamo em outro horário. Qual fica melhor?"', S["rep"])],
    [Paragraph('"Não gostei do produto."', S["rep"]), Paragraph('"Sinto muito. Me conta o que houve? Quero entender e te ajudar a ter o resultado certo."', S["rep"])],
    [Paragraph('"Como usa mesmo?"', S["rep"]), Paragraph('"Te explico em 30 segundos: um sachê/medida por tanque, antes de abastecer. Posso mandar um vídeo também."', S["rep"])],
    [Paragraph('"Achei caro."', S["rep"]), Paragraph('"Entendo. Pensando por tanque, dá R$ 5,99 na moto — menos que um café — protegendo o motor a cada abastecimento."', S["rep"])],
    [Paragraph('"Já respondi a pesquisa."', S["rep"]), Paragraph('"Perfeito, muito obrigado pelo apoio!"', S["rep"])],
]
obj = Table(obj_rows, colWidths=[CONTENT_W*0.34, CONTENT_W*0.66])
obj.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), VERDE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, TINT]),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("LEFTPADDING", (0,0), (-1,-1), 8),
    ("RIGHTPADDING", (0,0), (-1,-1), 8),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LINEBELOW", (0,0), (-1,-1), 0.5, TINTB),
    ("LINEAFTER", (0,0), (0,-1), 0.5, TINTB),
]))
story.append(obj)
story.append(spacer(14))

# ---------- FOLLOW-UP + REGISTRO ----------
fu = Table([[
    Paragraph("<b>QUANDO RETORNAR (FOLLOW-UP)</b><br/>"
              "• Não usou ainda → em ~7 dias<br/>"
              "• Problema / detrator → em 48h, com a solução<br/>"
              "• Não respondeu → 1 lembrete em 48h (não insistir além disso)", S["body"]),
    Paragraph("<b>O QUE REGISTRAR A CADA CONTATO</b><br/>"
              "Nome • Pedido • Recebeu OK? • Usou? • Resultado • Nota NPS • Categoria • Observações e pendências", S["body"]),
]], colWidths=[CONTENT_W/2, CONTENT_W/2])
fu.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), TINT),
    ("LINEBEFORE", (0,0), (0,0), 3, LIMAO),
    ("LINEBEFORE", (1,0), (1,0), 3, LIMAO),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("LEFTPADDING", (0,0), (-1,-1), 9),
    ("RIGHTPADDING", (0,0), (-1,-1), 9),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
]))
story.append(fu)

# ---------- DOC TEMPLATE com rodape ----------
def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(TINTB)
    canvas.setLineWidth(0.5)
    canvas.line(LM, 12*mm, PAGE_W-RM, 12*mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTE)
    canvas.drawString(LM, 8*mm, "CarboZé — Documento interno do time de pós-venda")
    canvas.drawRightString(PAGE_W-RM, 8*mm, "Pág. %d" % doc.page)
    canvas.restoreState()

frame = Frame(LM, 16*mm, CONTENT_W, PAGE_H-16*mm-12*mm, id="main",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=LM, rightMargin=RM,
                      topMargin=12*mm, bottomMargin=16*mm)
doc.addPageTemplates([PageTemplate(id="t", frames=[frame], onPage=footer)])
doc.build(story)
print("OK:", OUT)
