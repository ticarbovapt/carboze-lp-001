# -*- coding: utf-8 -*-
"""Gera o PDF do roteiro de abordagem pos-venda da CarboZe (ate o envio do link NPS).
Uso: python scripts/gen_roteiro_posvenda_pdf.py
Saida: docs/roteiro-pos-venda-carboze.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
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
S["note"]    = ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=8.8, leading=12, textColor=MUTE)
S["white"]   = ParagraphStyle("white", fontName="Helvetica", fontSize=9.5, leading=13, textColor=colors.white)
S["msg"]     = ParagraphStyle("msg", fontName="Helvetica", fontSize=9.8, leading=14, textColor=INK)

PAGE_W, PAGE_H = A4
LM = RM = 16 * mm
CONTENT_W = PAGE_W - LM - RM

story = []

def section_header(title):
    p = Paragraph(title, S["step"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), VERDE),
        ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LINEBELOW", (0,0), (-1,-1), 2.2, LIMAO),
    ]))
    return t

def step_header(num, title):
    p = Paragraph(f'PASSO {num} &nbsp;&nbsp;|&nbsp;&nbsp; {title}', S["step"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), VERDE),
        ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LINEBELOW", (0,0), (-1,-1), 2.2, LIMAO),
    ]))
    return t

def boxed(text, style, bar=LIMAO, bg=TINT):
    p = Paragraph(text, style)
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("LINEBEFORE", (0,0), (-1,-1), 3, bar),
        ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return t

def ask_block(text):
    return boxed(text, S["ask"], bar=LIMAO)

def consult_line(text):
    return boxed(f'<b>Consultor:</b> "{text}"', S["consult"], bar=VERDEM)

def branch(letter, cli, rep, action=None):
    inner = [Paragraph(f'<b>Cliente:</b> {cli}', S["cli"]), Spacer(1, 2),
             Paragraph(f'<b>Consultor:</b> {rep}', S["rep"])]
    if action:
        inner.append(Spacer(1, 2)); inner.append(Paragraph(action, S["note"]))
    tag = Table([[Paragraph(letter, S["tag"])]], colWidths=[16], rowHeights=[16])
    tag.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIMAO), ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 0), ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING", (0,0), (-1,-1), 2), ("BOTTOMPADDING", (0,0), (-1,-1), 0),
    ]))
    t = Table([[tag, inner]], colWidths=[24, CONTENT_W-24])
    t.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("BACKGROUND", (0,0), (-1,-1), colors.white),
        ("LINEBELOW", (0,0), (-1,-1), 0.6, TINTB),
        ("LEFTPADDING", (0,0), (0,0), 0), ("LEFTPADDING", (1,0), (1,0), 8),
        ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return t

def spacer(h=8):
    return Spacer(1, h)

def msg_card(titulo, texto):
    head = Paragraph(titulo, S["white"])
    ht = Table([[head]], colWidths=[CONTENT_W])
    ht.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), VERDEM),
        ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    bt = Table([[Paragraph(texto, S["msg"])]], colWidths=[CONTENT_W])
    bt.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), TINT),
        ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ]))
    return KeepTogether([ht, bt, spacer(7)])

# ---------- HEADER ----------
header = Table([
    [Paragraph("CARBOZÉ", ParagraphStyle("logo", fontName="Helvetica-Bold", fontSize=15, textColor=colors.white))],
    [Paragraph("ROTEIRO DE ABORDAGEM PÓS-VENDA", S["title"])],
    [Paragraph("Abordar o cliente que já recebeu e encaminhar a pesquisa de satisfação (NPS)", S["sub"])],
], colWidths=[CONTENT_W])
header.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), VERDE),
    ("LEFTPADDING", (0,0), (-1,-1), 14), ("RIGHTPADDING", (0,0), (-1,-1), 14),
    ("TOPPADDING", (0,0), (0,0), 12), ("BOTTOMPADDING", (0,0), (0,0), 2),
    ("TOPPADDING", (0,1), (0,1), 2), ("TOPPADDING", (0,2), (0,2), 4),
    ("BOTTOMPADDING", (0,2), (0,2), 12),
    ("LINEBELOW", (0,-1), (-1,-1), 3, LIMAO),
]))
story.append(header)
story.append(spacer(10))

# ---------- OBJETIVO ----------
story.append(Paragraph("O objetivo deste contato", S["h2"]))
story.append(Paragraph(
    "O consultor de pós-venda <b>inicia</b> o contato com o cliente que já recebeu o produto, garante que "
    "deu tudo certo e <b>encaminha o link da pesquisa</b>. O cliente responde o NPS na própria página — "
    "este roteiro vai <b>somente até o envio do link</b>.", S["body"]))
story.append(spacer(4))
story.append(boxed('<b>Link da pesquisa:</b> &nbsp; carboze.com.br/nps', S["ask"], bar=LIMAO))
story.append(spacer(8))

dos = Table([[
    Paragraph("<b>FAÇA</b><br/>• Aborde só quem já recebeu<br/>• Horário comercial, tom humano<br/>• Espere a resposta antes de mandar o link<br/>• Personalize com o nome do cliente", S["body"]),
    Paragraph("<b>EVITE</b><br/>• Enviar o link sem contexto<br/>• Insistir após recusa<br/>• Soar como robô / script decorado<br/>• Disparar para vários de uma vez", S["body"]),
]], colWidths=[CONTENT_W/2, CONTENT_W/2])
dos.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,0), TINT),
    ("BACKGROUND", (1,0), (1,0), colors.HexColor("#fbeceA")),
    ("LINEBEFORE", (0,0), (0,0), 3, VERDEM),
    ("LINEBEFORE", (1,0), (1,0), 3, colors.HexColor("#d98b8b")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
    ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 8),
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
           "Ação: siga para o Passo 3."),
    branch("B", '"Chegou, mas teve um problema (atraso, avaria ou faltou item)."',
           '"Sinto muito por isso, {nome}. Me conta o que aconteceu que eu já resolvo pra você."',
           "Ação: registre, resolva a ocorrência e, ao final, siga para o Passo 3."),
    branch("C", '"Ainda não chegou."',
           '"Vou verificar o rastreio agora mesmo e te dou um retorno."',
           "Ação: trate como logística e pause o pós-venda até a entrega. Não envie o link ainda."),
]))
story.append(spacer(12))

# ---------- PASSO 3 ----------
story.append(KeepTogether([
    step_header(3, "A PONTE + ENVIO DO LINK"),
    spacer(5),
    consult_line('Que bom! A gente está ouvindo quem já recebeu para melhorar cada vez mais. Você pode responder '
                 'uma pesquisa rapidinha, de menos de 1 minuto? Sua opinião ajuda demais.'),
    spacer(5),
    branch("A", '"Pode!"',
           '"Perfeito! É só clicar aqui: carboze.com.br/nps. Qualquer dúvida, me chama por aqui. Obrigado, {nome}!"',
           "Ação: envie o link. Fim do contato no Passo 4."),
    branch("B", '"Agora não posso."',
           '"Sem problema! Deixo o link aqui e você responde quando puder: carboze.com.br/nps"',
           "Ação: envie o link mesmo assim. Se não responder, faça 1 lembrete em ~48h."),
    branch("C", '"Ainda não usei o produto."',
           '"Tranquilo! A pesquisa também pergunta sobre a entrega — pode responder mesmo antes de testar: carboze.com.br/nps"',
           "Ação: envie o link e siga para o Passo 4."),
]))
story.append(spacer(12))

# ---------- PASSO 4 ----------
story.append(KeepTogether([
    step_header(4, "ENCERRAMENTO"),
    spacer(5),
    consult_line('Obrigado pelo seu tempo, {nome}! Qualquer dúvida sobre o produto — ou quando quiser repor — '
                 'é só me chamar por aqui. Boa estrada!'),
    spacer(4),
    Paragraph("• Cliente <b>satisfeito</b>: agradeça e, se fizer sentido, convide a avaliar na loja onde comprou.  "
              "• Cliente com <b>problema</b>: confirme a solução e o prazo de retorno.", S["body"]),
]))
story.append(spacer(14))

# ---------- MENSAGENS PRONTAS ----------
story.append(section_header("MENSAGENS PRONTAS (copiar e colar no WhatsApp)"))
story.append(spacer(7))
story.append(msg_card("1) Abertura",
    "Olá, {nome}! Aqui é o [seu nome], do time de pós-venda da CarboZé. Tudo bem? "
    "Vi que seu pedido já foi entregue — chegou tudo certinho com você?"))
story.append(msg_card("2) Ponte + pedido (após a resposta)",
    "Que bom! A gente está ouvindo quem já recebeu para melhorar cada vez mais. "
    "Você pode responder uma pesquisa rapidinha (menos de 1 minuto)? Sua opinião ajuda demais."))
story.append(msg_card("3) Envio do link",
    "É só clicar aqui: carboze.com.br/nps<br/>Qualquer dúvida, me chama por aqui. Obrigado, {nome}!"))
story.append(msg_card("4) Lembrete (se não responder em ~48h — enviar só uma vez)",
    "Oi, {nome}! Passando só para lembrar da pesquisa rápida do CarboZé: carboze.com.br/nps "
    "(e prometo não encher)."))

# ---------- DOC TEMPLATE ----------
def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(TINTB); canvas.setLineWidth(0.5)
    canvas.line(LM, 12*mm, PAGE_W-RM, 12*mm)
    canvas.setFont("Helvetica", 8); canvas.setFillColor(MUTE)
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
