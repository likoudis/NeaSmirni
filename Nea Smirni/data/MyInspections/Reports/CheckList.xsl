<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">

		<html>
			<head>
				<style type="text/css">
					.header
					{
					font-size: 11pt;
					text-decoration: underline;
					font-weight:bold;
					}
					.muniname
					{
					font-family: Arial;
					font-size: 10pt;
					}
					.munilogotd
					{
					padding-left=0px;
					vertical-align: top;
					}
					.munitd
					{
					padding-left=5px;
					vertical-align: top;
					}
					td
					{
					padding-left=20px;
					}
					body
					{
					font-family: Arial;
					}
				</style>
			</head>
			<body>
				<table id="xlistXMLTable1" border = "0">
					<tr>
						<td class="munilogotd">
							<img src="{Inspection/LogoPath}" alt="Logo" border="0"></img>
						</td>
						<td class="munitd">
							<pre class="muniname">
								<xsl:value-of select="Inspection/MunicipalityName"/>
								<br></br>
								<xsl:value-of select="Inspection/MunicipalityAddress"/>
							</pre>
						</td>
					</tr>
				</table>
				<!-- Check List Items -->
				<h2 id="xlistXMLH2">
					Check List Items: <xsl:value-of select="Inspection/OfficeDocID"/>
				</h2>
				<table id="xlistXMLTable3" border = "0" width = "100%">
					<tr class="header">
						<td>Status</td>
						<td>Description</td>
						<td>Notes</td>
					</tr>
					<xsl:for-each select="Inspection/CheckListItems/CheckListItem">
						<tr>
							<td>
								<xsl:value-of select="Status" />
							</td>
							<td>
								<xsl:value-of select="Description" />
							</td>
							<td>
								<xsl:value-of select="Notes" />
							</td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>