#!/usr/bin/env python3
"""
PDF报告生成器
将详细技术分析报告转换为PDF格式
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

def convert_markdown_to_pdf(md_content, output_pdf):
    """将Markdown内容转换为PDF"""
    print(f"生成PDF: {output_pdf}")

    # 优先使用工作区内嵌入的思源宋体，其次回退系统中文字体
    font_name = 'SourceHanSerifSC'
    font_candidates = [
        ('SourceHanSerifSC', '/Users/brain/.openclaw/workspace/fonts/SourceHanSerifSC-Regular.otf'),
        ('STSongti', '/System/Library/Fonts/Supplemental/Songti.ttc'),
        ('STHeitiLight', '/System/Library/Fonts/STHeiti Light.ttc'),
        ('STHeitiMedium', '/System/Library/Fonts/STHeiti Medium.ttc'),
    ]
    registered = False
    for candidate_name, candidate_path in font_candidates:
        if Path(candidate_path).exists():
            try:
                pdfmetrics.registerFont(TTFont(candidate_name, candidate_path))
                font_name = candidate_name
                registered = True
                break
            except Exception:
                pass
    if not registered:
        try:
            pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
            font_name = 'STSong-Light'
        except Exception:
            pass
    
    # 创建PDF文档
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # 获取样式
    styles = getSampleStyleSheet()
    
    # 自定义样式
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName=font_name,
        fontSize=16,
        leading=22,
        spaceAfter=12,
        textColor=colors.HexColor('#2c3e50')
    )
    
    heading1_style = ParagraphStyle(
        'CustomHeading1',
        parent=styles['Heading2'],
        fontName=font_name,
        fontSize=14,
        leading=20,
        spaceAfter=8,
        textColor=colors.HexColor('#34495e')
    )
    
    heading2_style = ParagraphStyle(
        'CustomHeading2', 
        parent=styles['Heading3'],
        fontName=font_name,
        fontSize=12,
        leading=18,
        spaceAfter=6,
        textColor=colors.HexColor('#7f8c8d')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontName=font_name,
        fontSize=10,
        leading=16,
        spaceAfter=6,
        textColor=colors.HexColor('#2c3e50')
    )
    
    # 构建内容
    story = []
    
    # 添加标题
    lines = md_content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('# '):
            # 主标题
            story.append(Paragraph(line[2:], title_style))
            story.append(Spacer(1, 0.2*inch))
        elif line.startswith('## '):
            # 一级标题
            story.append(Paragraph(line[3:], heading1_style))
            story.append(Spacer(1, 0.1*inch))
        elif line.startswith('### '):
            # 二级标题
            story.append(Paragraph(line[4:], heading2_style))
            story.append(Spacer(1, 0.05*inch))
        else:
            # 普通文本
            story.append(Paragraph(line, normal_style))
            story.append(Spacer(1, 0.05*inch))
    
    # 生成PDF
    doc.build(story)
    print(f"✅ PDF生成完成: {output_pdf}")
    return True

def main():
    """主函数"""
    if len(sys.argv) < 3:
        print("用法: python pdf_generator.py <输入文件> <输出PDF文件>")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2])
    
    if not input_file.exists():
        print(f"错误: 输入文件不存在 {input_file}")
        sys.exit(1)
    
    # 读取内容
    content = input_file.read_text(encoding='utf-8')
    
    # 转换为PDF
    success = convert_markdown_to_pdf(content, output_file)
    
    if success:
        print(f"\n📄 报告信息:")
        print(f"   输入文件: {input_file}")
        print(f"   输出PDF: {output_file}")
        print(f"   生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   文件大小: {output_file.stat().st_size if output_file.exists() else 0} bytes")
    else:
        print("❌ PDF生成失败")

if __name__ == "__main__":
    main()
