import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Pattern de fond */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Contenu principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '60px',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            maxWidth: '900px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Icône CV */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '100px',
                backgroundColor: '#667eea',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '70px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px',
                  gap: '4px',
                }}
              >
                <div style={{ width: '100%', height: '8px', backgroundColor: '#667eea', borderRadius: '2px' }} />
                <div style={{ width: '80%', height: '4px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                <div style={{ width: '60%', height: '4px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                <div style={{ width: '90%', height: '4px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                <div style={{ width: '70%', height: '4px', backgroundColor: '#ccc', borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px',
            }}
          >
            CV Builder
          </h1>

          {/* Sous-titre */}
          <p
            style={{
              fontSize: '28px',
              color: '#666',
              margin: '0 0 40px 0',
              lineHeight: '1.4',
            }}
          >
            Créez votre CV professionnel en quelques minutes
          </p>

          {/* Fonctionnalités */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '50%' }} />
              <span style={{ fontSize: '20px', color: '#666' }}>Interface intuitive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#FF9800', borderRadius: '50%' }} />
              <span style={{ fontSize: '20px', color: '#666' }}>Thèmes modernes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', borderRadius: '50%' }} />
              <span style={{ fontSize: '20px', color: '#666' }}>Export PDF</span>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              backgroundColor: '#FF6B6B',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '20px 40px',
              borderRadius: '50px',
              boxShadow: '0 10px 25px rgba(255, 107, 107, 0.3)',
            }}
          >
            🚀 Commencer maintenant
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
