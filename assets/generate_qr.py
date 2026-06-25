import segno
from xml.etree import ElementTree as ET
import cairosvg
import io
from PIL import Image

def generate_svg_qr_with_padded_logo(data, logo_path, filename="qr_with_padded_logo.svg"):
    """
    Generates a QR code in SVG format and embeds a horizontally padded,
    crisp SVG logo in the center with a white background.

    Args:
        data (str): The text or URL to encode in the QR code.
        logo_path (str): The file path to the logo image (e.g., 'logo.svg').
        filename (str): The desired filename for the output SVG QR code.
    """
    # 1. Generate the QR code SVG using segno
    qr = segno.make(data, error='H')
    
    # Save the QR code to an in-memory byte stream
    qr_svg_stream = io.BytesIO()
    # Use scale=10 for better rendering quality.
    qr.save(qr_svg_stream, kind='svg', scale=10)
    qr_svg_stream.seek(0)
    
    # Parse the SVG XML
    qr_svg = ET.fromstring(qr_svg_stream.read().decode('utf-8'))
    
    # Get the SVG dimensions from either the viewBox or width/height attributes
    viewbox = qr_svg.get('viewBox')
    if viewbox:
        viewbox_parts = viewbox.split()
        qr_width = float(viewbox_parts[2])  # Correctly extract width from viewbox
        qr_height = float(viewbox_parts[3]) # Correctly extract height from viewbox
    else:
        qr_width = float(qr_svg.get('width'))
        qr_height = float(qr_svg.get('height'))

    # 2. Prepare the horizontally-padded white background for the logo
    padded_width = qr_width * 0.50
    padded_height = qr_height * 0.20
    rect_x = (qr_width - padded_width) / 2
    rect_y = (qr_height - padded_height) / 2

    rect = ET.Element("rect", {
        "x": str(rect_x),
        "y": str(rect_y),
        "width": str(padded_width),
        "height": str(padded_height),
        "fill": "#FFFFFF"
    })
    
    # 3. Prepare the logo group
    with open(logo_path, 'r', encoding='utf-8') as f:
        logo_svg = ET.fromstring(f.read())
    
    # Use cairosvg to get original logo dimensions for consistent scaling
    png_data = cairosvg.svg2png(url=logo_path)
    logo_img = Image.open(io.BytesIO(png_data))
    logo_width_px, logo_height_px = logo_img.size
    
    # Calculate logo size to fit inside the padded area, maintaining aspect ratio
    max_logo_width = padded_width * 0.9
    max_logo_height = padded_height * 0.9
    logo_ratio = logo_width_px / logo_height_px
    
    if logo_ratio > 1:
        new_logo_width = max_logo_width
        new_logo_height = new_logo_width / logo_ratio
    else:
        new_logo_height = max_logo_height
        new_logo_width = new_logo_height * logo_ratio

    # Position the logo in the center of the padding
    logo_x = rect_x + (padded_width - new_logo_width) / 2
    logo_y = rect_y + (padded_height - new_logo_height) / 2
    
    # Create a group element for the logo with transformations
    logo_g = ET.Element("g", {
        "transform": f"translate({logo_x}, {logo_y}) scale({new_logo_width/logo_width_px}, {new_logo_height/logo_height_px})"
    })
    
    # Check if the logo has a viewbox and adjust scale factor if needed
    logo_viewbox = logo_svg.get('viewBox')
    if logo_viewbox:
        logo_viewbox_parts = logo_viewbox.split()
        # Scale to match the new logo size within the viewbox
        logo_g_scale_x = new_logo_width / float(logo_viewbox_parts[2])
        logo_g_scale_y = new_logo_height / float(logo_viewbox_parts[3])
        logo_g.set("transform", f"translate({logo_x}, {logo_y}) scale({logo_g_scale_x}, {logo_g_scale_y})")
    
    for child in list(logo_svg):
        logo_g.append(child)

    # 4. Find the QR code path and insert elements in the correct order
    path_element = qr_svg.find(".//{http://www.w3.org/2000/svg}path")
    if path_element is not None:
        path_index = list(qr_svg).index(path_element)
        qr_svg.insert(path_index, rect)  # Insert background before path
        qr_svg.insert(path_index + 1, logo_g) # Insert logo after background
    else:
        # Fallback if path element isn't found
        qr_svg.insert(0, rect)
        qr_svg.insert(1, logo_g)
        
    # 5. Save the final SVG file
    with open(filename, "wb") as f:
        f.write(ET.tostring(qr_svg))
    
    print(f"QR code with padded logo saved as {filename}")

if __name__ == "__main__":
    my_data = "https://ivorytusk.co.in/qr"
    my_logo = "IvoryTusk_LightModeTM.svg"

    generate_svg_qr_with_padded_logo(my_data, my_logo)
