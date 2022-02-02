from app import create_app, db
import app.models
from app.models.models import SensorType

app = create_app()

@app.before_first_request
def initDB(*args, **kwargs):
    db.create_all()

    if SensorType.query.count() == 0:
        db.session.add(SensorType(name='Temperature', description='Temperature sensor (deg C)'))
        db.session.add(SensorType(name='pH', description='pH sensor readings (0-12)'))
        db.session.commit()

if __name__ == "__main__":
    app.run(debug=True, port=5000)