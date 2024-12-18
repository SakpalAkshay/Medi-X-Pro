import logging # type: ignore

def report_generator(report):

    try:
        detailed_report = {}
        rs = report.replace("\n", "").replace("##", "").replace("*", "").strip()
        detailed_report['detailed_analysis'] = rs.split("Detailed Analysis:")[1].split("Analysis Report:")[0].strip()
        detailed_report['analysis_report'] = rs.split("Analysis Report:")[1].split("Recommendations")[0].strip()
        detailed_report['recommendations'] = rs.split("Recommendations:")[1].split("Treatment Options:")[0].strip()
        detailed_report['treatment_options'] = rs.split("Treatment Options:")[1].split("Consult")[0].strip()
        detailed_report['disclaimer'] = "Consult with a doctor before making any medical decisions."
    except Exception as e:
        logging.error("Caught some Indexing error!!!")

    return detailed_report



def drug_doc_report(report):
    try:
        rs = report.replace("\n", "").replace("##", "").replace("*", "").strip()
        detailed_report = {}
        detailed_report["drug_identification"] = rs.split("Drug Identification:")[0].split("Mechanism of Action & Therapeutic Use")[0].strip()
        detailed_report["mechanism_of_action"] = rs.split("Mechanism of Action & Therapeutic Use")[1].split("Dosage and Administration")[0].strip()
        detailed_report["dosage_and_administration"] = rs.split("Dosage and Administration")[1].split("Side Effects and Warnings")[0].strip()
        detailed_report["side_effects_and_warnings"] = rs.split("Side Effects and Warnings")[1].split("Pregnancy Category & Use in Pregnancy")[0].strip()
        detailed_report["additional_considerations"] = rs.split("Additional Considerations")[1].strip()
        detailed_report["disclaimer"] = "Consult with a doctor or pharmacist before making any decisions related to drug use"
    except Exception as e:
        logging.error("Caught some Indexing error!!!")

    return detailed_report



def patient_image_report(report):
    try:
        rs = report.replace("\n", "").replace("##", "").replace("*", "").strip()
        detailed_report = {}
        detailed_report["Image Results"] = rs.split("Simple Image Explanation:")[1].split("Patient-Friendly Report:")[0].strip()
        detailed_report["Image Explanation"] = rs.split("Patient-Friendly Report:")[1].split("Recommendations for Next Steps:")[0].strip()
        detailed_report["Next Steps"] = rs.split("Recommendations for Next Steps:")[1].split("General Treatment Guidance (if applicable):")[0].strip()
        detailed_report["Treatment Guidance"] = rs.split("General Treatment Guidance (if applicable):")[1].strip()
    except Exception as e:
        logging.error("Caught some Indexing error!!!")
    return detailed_report


def patient_drug_report(report):
    try:
        rs = report.replace("\n", "").replace("##", "").replace("*", "").strip()
        detailed_report = {}
        detailed_report["Drug Overview"] = rs.split("Drug Overview")[1].split("How to Take the Drug")[0].strip()
        detailed_report["How to take the drug"] = rs.split("How to Take the Drug")[1].split("What to Expect (Side Effects)")[0].strip()
        detailed_report["Side Effects"] = rs.split("What to Expect (Side Effects)")[1].split("Special Precautions")[0].strip()
        detailed_report["Special Precautions"] = rs.split("Special Precautions")[1].split("When to Seek Help")[0].strip()
        detailed_report["When to seek help"] = rs.split("When to Seek Help")[1].split("Additional Information")[0].strip()
        detailed_report["Additional Information"] = rs.split("Additional Information")[1].strip()
    except Exception as e:
        logging.error("Caught some Indexing error!!!")
    return detailed_report

